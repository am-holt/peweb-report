export class DefaultViewDescriptor  implements ViewDescriptor{
	
	static readonly DEFAULT_TYPE = "default"

	//The type of the view descriptor
	type:string;

	//List of the nodes attributes
	attributes: Attribute[];

	//List of the node's reference features
	references: Reference[];

	//The id of the node which this projection describes
	nodeId: string;

	constructor(atts:Attribute[],refs:Reference[],id:string){
		this.type = "default";
		this.attributes = atts;
		this.references = refs;
		this.nodeId = id;
	}
}

export class Attribute{
	//The name of the attribute this describes
	name:string;

	//The datatype of the attribute
	type:string;

	//The initial value of the attribute
	value:string;
}

export class Reference{
	//The name of the reference feature
	name:string;

	//Whether or not this reference represents a crossReference
	crossReference :boolean;

	//Present iff this reference feature is a cross reference
	//The possible nodes this reference could cross reference
	possibleCrossReferences : NodeReference[];

	//Present iff this reference feature is a containment reference
	//The possible types of node this reference may contain
	possibleTypes:string[];

	//The list of nodes referenced in this feature
	nodes:NodeReference[];
}