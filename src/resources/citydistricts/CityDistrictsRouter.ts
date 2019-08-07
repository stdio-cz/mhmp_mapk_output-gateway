/**
 * CityDistrictsRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { Router } from "express";
import { CityDistrictsModel } from ".";
import { GeoJsonRouter } from "../../core/routes";

export class CityDistrictsRouter extends GeoJsonRouter {

    constructor() {
        super(new CityDistrictsModel());
        this.initRoutes();
    }

}

const cityDistrictsRouter: Router = new CityDistrictsRouter().router;

export { cityDistrictsRouter };
