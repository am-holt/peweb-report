package ox.xtext.peweb.graph.peweb;

import org.eclipse.xtext.peweb.OpenFileState;
import org.eclipse.xtext.peweb.ResourceAbstractSyntaxTree;
import org.eclipse.xtext.peweb.TypeHelper;
import org.eclipse.xtext.peweb.customview.ProjectionDescription;
import org.eclipse.xtext.peweb.customview.ViewRetriever;

import ox.xtext.peweb.graph.graph.GraphConstant;
import ox.xtext.peweb.graph.peweb.projections.GraphProjectionDescription;

public class GraphViewRetriever extends ViewRetriever {

	 public ProjectionDescription getView(TypeHelper typeHelper, OpenFileState ofs, ResourceAbstractSyntaxTree node) {
		
		 //If no named projection has been requested
		 if(node.getEObject() instanceof GraphConstant) {
			 return new GraphProjectionDescription(node.getNodeId(),(GraphConstant)node.getEObject(), ofs);
		 }
		 
		
		return super.getView(typeHelper, ofs, node);
	}
	
}
