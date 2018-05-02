package ox.xtext.peweb.graph.peweb.projections;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.emf.common.util.EList;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.xtext.peweb.OpenFileState;
import org.eclipse.xtext.peweb.customview.ProjectionDescription;

import ox.xtext.peweb.graph.graph.Edge;
import ox.xtext.peweb.graph.graph.GraphConstant;
import ox.xtext.peweb.graph.graph.Vertex;

public class GraphProjectionDescription extends ProjectionDescription {

	public List<SimpleVertex> vertices;
	public List<SimpleEdge> edges; 
	public String nodeId;
	
	public GraphProjectionDescription(String nodeId, GraphConstant graph, OpenFileState ofs) {
		
		this.nodeId = nodeId;
		
		//Set the projections type
		this.type = "NodeGraph";
		
		//This object will be serialised as jso
		//We thus create Simple representation of the graph to 
		//prevent sending unneccesary information from the EObject itself
		EList<Edge> es =  graph.getEdges();
		EList<Vertex> vs = graph.getVertices();
		
		vertices = new ArrayList<SimpleVertex>(es.size());
		edges = new ArrayList<SimpleEdge>(vs.size());
		
		for(Edge e : es) {
			edges.add(new SimpleEdge(e,ofs.getEObjectId(e)));
		}
		for(Vertex v : vs) {
			vertices.add(new SimpleVertex(v,ofs.getEObjectId(v)));
		}
	}
	
	private class SimpleVertex{
		public String id;
		public String nodeId;
		public SimpleVertex(Vertex v, String nodeId) { 
			this.id= v.getName();
			this.nodeId = nodeId; 
		}
	}
	
	private class SimpleEdge{
		public String source;
		public String target;
		public String nodeId; 
		
		public SimpleEdge(Edge e, String nodeId) {
			this.source = e.getSource().getName() ; 
			this.target = e.getDest().getName();
			this.nodeId = nodeId;
		}
	}
	
}
