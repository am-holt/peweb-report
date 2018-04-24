class DefaultViewDescriptor  implements ViewDescriptor{
	
	static readonly DEFAULT_TYPE = "default"

	//The type of the descriptor
	type:string = DefaultViewDescriptor.DEFAULT_TYPE;

	//List of the nodes attributes to display
	attributes: Attribute[];

	//List of the node's reference sets to display
	references: Reference[];

	//The id of the node this describes
	nodeId: string;
}

class Attribute{
	//The name of the attribute this describes
	name:string;

	//The datatype of the attribute
	type:string;

	//The initial value of the attribute
	value:string;
}

class Reference{
	//The name of the referenceSet
	name:string;

	//The list of nodes references
	nodes:NodeReference[];
}

class NodeReference{
	//The name of the referenced node, if given one ny the language server
	name:string;

	//The nodeId of the referenced node
	nodeId: string;
}