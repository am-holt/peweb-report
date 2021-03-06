package org.eclipse.xtext.peweb.services;

import static org.junit.jupiter.api.Assertions.*;

import java.io.File;
import java.util.HashMap;

import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.junit.jupiter.api.Test;
import org.eclipse.xtext.peweb.MockOpenResources;
import org.eclipse.xtext.peweb.exceptions.ResourceLoadingException;
import org.eclipse.xtext.web.example.statemachine.statemachine.*;
import org.eclipse.xtext.web.server.InvalidRequestException;
import org.eclipse.xtext.web.server.InvalidRequestException.ResourceNotFoundException;

class RemoveNodeReferenceServiceTest extends AbstractAPIServiceTester {

	//The Statemachine EMF model is used to build AST structures
	private StatemachineFactory statemachineFactory = StatemachineFactory.eINSTANCE;
	
	//Test to ensure if param is missing from an API call an exception is thrown
	void testMissingParameter(String param) {
		
		HashMap<String,EObject> mockFiles = new HashMap<String,EObject>();
		MockOpenResources mockOpenResources = new MockOpenResources(mockFiles);
		RemoveNodeReferenceService service = new RemoveNodeReferenceService(mockOpenResources);
				
		//Initialise the API call parameters
		HashMap<String,String> callParameters = new HashMap<String,String>();
		callParameters.put("serviceType", "remove-reference");
		callParameters.put("node-id", "11");
		callParameters.put("project-name", "proj");
		callParameters.put("file-name", "file");
		callParameters.put("reference-name", "ref");
		callParameters.put("reference-id", "21");
		
		//remove the parameter we want to miss!
		callParameters.remove(param);
		
		try {
			service.service(this.getServiceContext(callParameters));
			fail("No exception thrown");
		}catch(InvalidRequestException e) {
			
			//Assert that the error message mentions the missing parameter
			//By just using a contains we don't have to worry about exact messages changing
			assert(e.getMessage().contains(param));
		}
	}


	//Test to ensure no file-name parameter throws an exception
	@Test
	void testMissingFileNameParameter() {	
		testMissingParameter("file-name");
	}
	
	//Test to ensure no project-name parameter throws an exception
	@Test
	void testMissingProjNameParameter() {
		testMissingParameter("project-name");
	}	

	//Test to ensure no node-id parameter throws an exception
	@Test
	void testMissingNodeIdParameter() {
		testMissingParameter("node-id");
	}
	
	//Test to ensure no reference-name parameter throws an exception
	@Test
	void testMissingReferenceNameParameter() {
		testMissingParameter("reference-name");
	}
	
	//Test to ensure no reference-id parameter throws an exception
	@Test
	void testMissingReferenceIdParameter() {
		testMissingParameter("reference-id");
	}
	
	//Test to ensure if a file doesn't exist within a project returns the correct exception
	@Test
	void testNonExistantFile() {
		HashMap<String,EObject> mockFiles = new HashMap<String,EObject>();
		MockOpenResources mockOpenResources = new MockOpenResources(mockFiles);
		//Create service with no resources (files)
		RemoveNodeReferenceService service = new RemoveNodeReferenceService(mockOpenResources);
				
		//Initialise the API call parameters
		HashMap<String,String> callParameters = new HashMap<String,String>();
		callParameters.put("serviceType", "remove-reference");
		callParameters.put("node-id", "11");
		callParameters.put("project-name", "proj");
		callParameters.put("file-name", "file");
		callParameters.put("reference-name", "ref");
		callParameters.put("reference-id", "21");
		
		try {
			service.service(this.getServiceContext(callParameters));
			fail("No exception thrown");
		}catch(ResourceNotFoundException e) {
			
			//Assert that the error message mentions the file is missing
			//By just using a contains we don't have to worry about exact messages changing
			assert(e.getMessage().contains("file not found"));
		}
	}
	
	//Test to ensure if a node with the specified ID doesn't exist then an exception is thrown
	@Test
	void testNonExistantNode() {
		HashMap<String,EObject> mockFiles = new HashMap<String,EObject>();
		String mockFileName = "file"; String mockProject = "project"; 
		//Our AST root
		Statemachine root = statemachineFactory.createStatemachine();
		//The "location" our AST root is in
		String fileLocation = getFileLocation(mockProject,mockFileName);
		mockFiles.put(fileLocation, root);
		MockOpenResources mockOpenResources = new MockOpenResources(mockFiles);
		//Create service with no resources (files)
		RemoveNodeReferenceService service = new RemoveNodeReferenceService(mockOpenResources);
				
		//Initialise the API call parameters
		HashMap<String,String> callParameters = new HashMap<String,String>();
		callParameters.put("serviceType", "remove-reference");
		callParameters.put("node-id", "DOESNTEXIST");
		callParameters.put("project-name", mockProject);
		callParameters.put("file-name", mockFileName);
		callParameters.put("reference-name", "ref");
		callParameters.put("reference-id", "21");
		
		try {
			service.service(this.getServiceContext(callParameters));
			fail("No exception thrown");
		}catch(InvalidRequestException e) {
			
			//Assert that the error message mentions the node-id
			//By just using a contains we don't have to worry about exact messages changing
			assert(e.getMessage().contains("node-id"));
		}
	}
	
	..For brevity, only part of file listed here ..
}
