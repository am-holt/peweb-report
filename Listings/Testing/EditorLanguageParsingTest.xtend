
package org.eclipse.xtext.peweb.tests

import com.google.inject.Inject
import org.eclipse.xtext.testing.InjectWith
import org.eclipse.xtext.testing.XtextRunner
import org.eclipse.xtext.testing.util.ParseHelper
import org.junit.Assert
import org.junit.Test
import org.junit.runner.RunWith
import org.eclipse.xtext.peweb.editorLanguage.EditorDefinitionFile
import org.eclipse.xtext.peweb.tests.EditorLanguageInjectorProvider

@RunWith(XtextRunner)
@InjectWith(EditorLanguageInjectorProvider)
class EditorLanguageParsingTest {
	@Inject
	ParseHelper<EditorDefinitionFile> parseHelper
	
	//Invalid, just a word
	@Test
	def void loadPlainString() {
		val result = parseHelper.parse('''
			Test
		''')
		Assert.assertNotNull(result)
		val errors = result.eResource.errors
		Assert.assertFalse('''Unexpected errors: <<errors.join(", ")>>''', errors.isEmpty)
	}
	
	//Invalid, nested node
	@Test
	def void loadNestedNode() {
		val result = parseHelper.parse('''
			Node test{
				Node test2{}
			}
		''')
		Assert.assertNotNull(result)
		val errors = result.eResource.errors
		Assert.assertFalse('''Unexpected errors: <<errors.join(", ")>>''', errors.isEmpty)
	}
	
	//Invalid, nested projection
	@Test
	def void loadNestedProjection() {
		val result = parseHelper.parse('''
			Node test{
				projection main{
					projection main2{}
				}
			}
		''')
		Assert.assertNotNull(result)
		val errors = result.eResource.errors
		Assert.assertFalse('''Unexpected errors: <<errors.join(", ")>>''', errors.isEmpty)
	}
	
	//Invalid, projection missing view
	@Test
	def void loadProjectionNoView() {
		val result = parseHelper.parse('''
			Node test{
				Projection main{}
			}
		''')
		Assert.assertNotNull(result)
		val errors = result.eResource.errors
		Assert.assertFalse('''Unexpected errors: <<errors.join(", ")>>''', errors.isEmpty)
	}
	
	//Invalid, references non-existent component
	@Test
	def void loadNonExistentComponentRef() {
		val result = parseHelper.parse('''
			Node test{
				Projection main{
					view:[ <<%Component%>> ]	
				}
			}
		''')
		Assert.assertNotNull(result)
		val errors = result.eResource.errors
		Assert.assertFalse('''Unexpected errors: <<errors.join(", ")>>''', errors.isEmpty)
	}
	
	..For brevity, only part of file listed here ..

}
