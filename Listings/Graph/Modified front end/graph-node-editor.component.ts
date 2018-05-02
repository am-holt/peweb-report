import { Component,EventEmitter, Input, Output, OnInit, ViewEncapsulation } from '@angular/core';
import { EditService } from'../services/edit.service';
import {FileDetails } from '../file-details';
import {AbstractSyntaxTree } from '../abstract-syntax-tree';
import {NodeGraphViewDescriptor} from '../node-graph-view-descriptor';

import * as d3 from "d3";

@Component({
  selector: 'graph-node-editor',
  templateUrl: './graph-node-editor.component.html',
  styleUrls: ['./graph-node-editor.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GraphNodeEditorComponent implements OnInit {

  constructor(
    private editService: EditService
  ) { }

  ngOnInit() {
  }

  //The id of the project the node belongs to
  @Input() projId: string;
  //The details of the specific file the node being edited is in
  @Input() fileDetails: FileDetails;
  //The view descriptor retrieved from the get-node
  @Input() nodeViewDescriptor: NodeGraphViewDescriptor;
  //The subtree of the AST rooted at the node being edited
  @Input() nodeAST : AbstractSyntaxTree;
  //Used to trigger a resync with the server by calling get-node
  @Output() refresh = new EventEmitter<Boolean>();

  //Radius of the nodes in the graph
  radius = 10;

  ngAfterContentInit(){
  	//Initialise relevant attributes
  	var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        nodes = this.nodeViewDescriptor.vertices,
        links = this.nodeViewDescriptor.edges

    var selectedNode = null,
        selectedLink = null

    //init simulation itself and apply forces
    //charge_force repels other nodes
    //center_force forces towards centre of svg
  	var simulation = d3.forceSimulation()
  		.nodes(this.nodeViewDescriptor.vertices)
  		.force("charge_force", d3.forceManyBody())
  		.force("center_force",d3.forceCenter(width/2, height/2))
  	//Create the link force 
		//id determines which attribute we take from nodes
		var link_force =  d3.forceLink(links)
		                        .id(function(d) { return d.id; })
		                        .distance(150)

		simulation.force("link",link_force)
		//draw links
		var link = svg.append("g")
							.attr("class","links")
							.selectAll("line")
							
    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll(".node")

    function tickActions() {
    	//update circle positions to reflect node updates on each tick of the simulation 
    	node
    		.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"})
        // .attr("cx", function(d) { return d.x; })
        // .attr("cy", function(d) { return d.y; })

      link
      	.attr("x1", function(d) {return d.source.x; })
      	.attr("y1", function(d) {return d.source.y; })
      	.attr("x2", function(d) {return d.target.x; })
      	.attr("y2", function(d) {return d.target.y; })
  	} 	

    function clickNode(d, i) {

       if(selectedNode == null){
         selectedNode = d
         update()
       }else{
         var destNode = d
         var newLink = {source:selectedNode, target:d, nodeId:null}
         var lin = links.filter(function(l){return (newLink.source == l.source && newLink.target == l.target)});
         if(lin.length ==0){
           //Add newLink
           that.editService.addReference(that.projId, that.fileDetails, that.nodeViewDescriptor.nodeId, "edges", "Edge")
            .subscribe(a=>{
              that.nodeAST.addChild(a);
              newLink.nodeId = a.nodeId;
              that.editService.addCrossReference(that.projId, that.fileDetails, a.nodeId, "source", newLink.source.nodeId).subscribe(b =>{
                that.editService.addCrossReference(that.projId, that.fileDetails, a.nodeId, "dest", newLink.target.nodeId).subscribe(c =>{
                  links.push(newLink);
                  selectedNode = null;  
                  update();
                });
              });
            });
         }else{
            selectedNode = null;  
            update();
         }
       }
       d3.event.stopPropagation();
    }

    var that = this
    function clickCanvas(){
      if(selectedNode == null && selectedLink == null){
        
        var newNodeName = window.prompt("New node:");
        if(newNodeName !== null && newNodeName !== ""){
          var point = d3.mouse(this)
          var newNode = {id:newNodeName,x:point[0],y:point[1], nodeId:null}
          
          that.editService.addReference(that.projId, that.fileDetails, that.nodeViewDescriptor.nodeId, "vertices", "Vertex")
            .subscribe(a=>{
              that.nodeAST.addChild(a);
              newNode.nodeId = a.nodeId;
              that.editService.validateAttribute(that.projId, that.fileDetails, a.nodeId, "name", newNodeName).subscribe(a=>null);
              that.editService.updateAttribute(that.projId, that.fileDetails, a.nodeId, "name", newNodeName).subscribe(a=>null);
              nodes.push(newNode);    
              update();

            });
          
        }
      }else{
        selectedNode = null;
        selectedLink = null;
        update();

      }
    }

    function rightClickLink(d,i){
      d3.event.preventDefault()
      that.editService.removeReference(that.projId,that.fileDetails,that.nodeViewDescriptor.nodeId,(<any>d).nodeId, "edges")
        .subscribe(a=>{that.nodeAST.removeChild((<any>d).nodeId);this.refreshView()});
      links.splice(i,1)
      update();
    }

    function rightClickNode(d,i){
      d3.event.preventDefault()

      var j = 0;
      while(j<links.length){
        var l = links[j];
        if(l.source==d || l.target ==d){
          console.log("while")
          that.editService.removeReference(that.projId,that.fileDetails,that.nodeViewDescriptor.nodeId, l.nodeId, "edges")
            .subscribe(a=>{null});
          links.splice(j,1);
        }else{
          j = j+1;
        }
      }

      // links = links.filter(function(l){return (l.source!=d && l.target !=d)});
      console.log("Delete node")
      console.log(nodes)
      console.log(i)
      that.editService.removeReference(that.projId,that.fileDetails,that.nodeViewDescriptor.nodeId, d.nodeId, "vertices")
            .subscribe(a=>{null});
      nodes.splice(nodes.indexOf(d),1);
      //remove node
      update();
    }



    function update(){
      
      link = link.data(links)

      link.exit().remove()
      
      link = link.enter().append("line")
              .attr("stroke-width",4)
              .on("contextmenu",rightClickLink)
              .merge(link)

      node = node.data(nodes, function(d){return d.id;})
      
      node.selectAll('circle')
        .attr('fill', function(d) { return (d == selectedNode) ? "pink" : "red" })

      node.exit().remove();

      var g = node.enter().append("g").attr("class","node")
      g.append("circle")
        .attr("r", 30)
        .attr('fill',"red")
        .on("click", clickNode)
        .on("contextmenu",rightClickNode)

      g.append("text")
        .text(function(d) {return d.id})
        .attr("text-anchor","middle");

      node = g.merge(node);

      //restart the simulation  
      simulation.nodes(nodes)
      simulation.force("link").links(links)
      simulation.restart();
    }

    svg.on("click", clickCanvas);
    update();
  	simulation.on("tick",tickActions);

  }
}
