import {Renderer} from "./renderer";
import {ProjectReflection} from "../models/reflections/project";
import {UrlMapping} from "./models/UrlMapping";
import {NavigationItem} from "./models/NavigationItem";
import {RendererComponent} from "./components";
import {Component} from "../utils/component";
import {Resources} from "./utils/resources";


/**
 * Base class of all themes.
 *
 * A theme defines the logical and graphical output of a documentation. Themes are
 * directories containing a ```theme.js``` file defining a [[BaseTheme]] subclass and a
 * series of subdirectories containing templates and assets. You can select a theme
 * through the ```--theme <path/to/theme>``` commandline argument.
 *
 * The theme class controls which files will be created through the [[BaseTheme.getUrls]]
 * function. It returns an array of [[UrlMapping]] instances defining the target files, models
 * and templates to use. Additionally themes can subscribe to the events emitted by
 * [[Renderer]] to control and manipulate the output process.
 *
 * The default file structure of a theme looks like this:
 *
 * - ```/assets/```<br>
 *   Contains static assets like stylesheets, images or javascript files used by the theme.
 *   The [[AssetsPlugin]] will deep copy this directory to the output directory.
 *
 * - ```/layouts/```<br>
 *   Contains layout templates that the [[LayoutPlugin]] wraps around the output of the
 *   page template. Currently only one ```default.hbs``` layout is supported. Layout templates
 *   receive the current [[PageEvent]] instance as their handlebars context. Place the
 *   ```{{{contents}}}``` variable to render the actual body of the document within this template.
 *
 * - ```/partials/```<br>
 *   Contains partial templates that can be used by other templates using handlebars partial
 *   syntax ```{{> partial-name}}```. The [[PartialsPlugin]] loads all files in this directory
 *   and combines them with the partials of the default theme.
 *
 * - ```/templates/```<br>
 *   Contains the main templates of the theme. The theme maps models to these templates through
 *   the [[BaseTheme.getUrls]] function. If the [[Renderer.getTemplate]] function cannot find a
 *   given template within this directory, it will try to find it in the default theme
 *   ```/templates/``` directory. Templates receive the current [[PageEvent]] instance as
 *   their handlebars context. You can access the target model through the ```{{model}}``` variable.
 *
 * - ```/theme.js```<br>
 *   A javascript file that returns the definition of a [[BaseTheme]] subclass. This file will
 *   be executed within the context of TypeDoc, one may directly access all classes and functions
 *   of TypeDoc. If this file is not present, an instance of [[DefaultTheme]] will be used to render
 *   this theme.
 */
@Component({name:"rendrer:theme", internal:true})
export class Theme extends RendererComponent
{
    /**
     * The base path of this theme.
     */
    basePath:string;

    resources:Resources;


    /**
     * Create a new BaseTheme instance.
     *
     * @param renderer  The renderer this theme is attached to.
     * @param basePath  The base path of this theme.
     */
    constructor(renderer:Renderer, basePath:string) {
        super(renderer);
        
        this.basePath  = basePath;
        this.resources = new Resources(this);
    }


    /**
     * Test whether the given path contains a documentation generated by this theme.
     *
     * TypeDoc empties the output directory before rendering a project. This function
     * is used to ensure that only previously generated documentations are deleted.
     * When this function returns FALSE, the documentation will not be created and an
     * error message will be displayed.
     *
     * Every theme must have an own implementation of this function, the default
     * implementation always returns FALSE.
     *
     * @param path  The path of the directory that should be tested.
     * @returns     TRUE if the given path seems to be a previous output directory,
     *              otherwise FALSE.
     *
     * @see [[Renderer.prepareOutputDirectory]]
     */
    isOutputDirectory(path:string):boolean {
        return false;
    }


    /**
     * Map the models of the given project to the desired output files.
     *
     * Every theme must have an own implementation of this function, the default
     * implementation always returns an empty array.
     *
     * @param project  The project whose urls should be generated.
     * @returns        A list of [[UrlMapping]] instances defining which models
     *                 should be rendered to which files.
     */
    getUrls(project:ProjectReflection):UrlMapping[] {
        return [];
    }


    /**
     * Create a navigation structure for the given project.
     *
     * A navigation is a tree structure consisting of [[NavigationItem]] nodes. This
     * function should return the root node of the desired navigation tree.
     *
     * The [[NavigationPlugin]] will call this hook before a project will be rendered.
     * The plugin will update the state of the navigation tree and pass it to the
     * templates.
     *
     * @param project  The project whose navigation should be generated.
     * @returns        The root navigation item.
     */
    getNavigation(project:ProjectReflection):NavigationItem {
        return null;
    }
}