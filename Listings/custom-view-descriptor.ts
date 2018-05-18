export class CustomViewDescriptor  implements ViewDescriptor{

	static readonly CUSTOM_TYPE = "custom"

	//The type of the viewDescriptor, will be equal to CUSTOM_TYPE
	type:string;

	//The html to display to the user
	htmlView : string;

	//Descibes how to get and set the attributes in the view
	attributeControllers : AttributeController[];

	//Describes how to add and remove references in the view
	referenceControllers : ReferenceController[];
}

export class AttributeController{
	//The id of the node this attribute belongs to
	nodeId:string;

	//The name of the attribute this controller to
	attributeName: string;

	//A javascript method to describe how to get the value for the attribute from the view
	getter:string;

	//A javascript method to describe how to set the value for the attribute in the view
	setter:string;

	//The initial value of the attribute in this node
	initialValue:any;

	//A javascript method to describe how to locally check a value is valid, may have side effects such as painting things red etc.
	validator:string;
}

export class ReferenceController{
	//The id of the node the reference belongs to
	nodeId: string;

	//The name of the reference feature this controller is for
	referenceName:string;

	//The id of the button used to add another reference
	addSelectorId: string;

	//Whether or not this reference represents a crossReference
	crossReference :boolean;

	//Present iff crossReference == true
	//The possible nodes this reference could cross reference
	possibleCrossReferences : NodeReference[];

	//Present iff crossReference == false
	//The possible node types which may be contained in this reference
	possibleTypes: string[];

	//An array of the referenced nodes contained in this reference feature
	references: ReferenceItemController[];

}

export class ReferenceItemController{
	//The id of the node being referenced;
	nodeId: string;

	//The id of the button in the view used to remove the item;
	removeButtonId: string;
}


