/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 *  National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([
    'test/CustomMatchers.test',
    'src/geom/Sector',
    'src/geom/TileMatrix'
], function (
    CustomMatchers,
    Sector,
    TileMatrix) {
    "use strict";

    beforeEach(function () {
        jasmine.addMatchers(CustomMatchers);
    });

    describe("TileMatrix tileSector", function () {
        it("should produce the appropriate sectors matching the row/column index for a global coverage", function () {
            var sector = Sector.FULL_SPHERE;
            var matrixWidth = 4;
            var matrixHeight = 2;
            var tileWidth = 256;
            var tileHeight = 256;
            var tileMatrix = new TileMatrix(sector, matrixWidth, matrixHeight, tileWidth, tileHeight);
            var expectedSectors = [
                // row 0
                [new Sector(0, 90, -180, -90), new Sector(0, 90, -90, 0), new Sector(0, 90, 0, 90), new Sector(0, 90, 90, 180)],
                // row 1
                [new Sector(-90, 0, -180, -90), new Sector(-90, 0, -90, 0), new Sector(-90, 0, 0, 90), new Sector(-90, 0, 90, 180)]
            ];

            var actualSector, expectedSector;
            for (var row = 0; row < matrixHeight; row++) {
                for (var col = 0; col < matrixWidth; col++) {
                    expectedSector = expectedSectors[row][col];
                    actualSector = tileMatrix.tileSector(row, col);
                    expect(actualSector).toBeSector(expectedSector);
                }
            }
        });

        it("should produce the appropriate sectors matching the row/column index for a regional coverage", function () {
            var sector = new Sector(0, 90, 0, 90);
            var matrixWidth = 2;
            var matrixHeight = 2;
            var tileWidth = 256;
            var tileHeight = 256;
            var tileMatrix = new TileMatrix(sector, matrixWidth, matrixHeight, tileWidth, tileHeight);
            var expectedSectors = [
                // row 0
                [new Sector(45, 90, 0, 45), new Sector(45, 90, 45, 90)],
                // row 1
                [new Sector(0, 45, 0, 45), new Sector(0, 45, 45, 90)]
            ];

            var actualSector, expectedSector;
            for (var row = 0; row < matrixHeight; row++) {
                for (var col = 0; col < matrixWidth; col++) {
                    expectedSector = expectedSectors[row][col];
                    actualSector = tileMatrix.tileSector(row, col);
                    expect(actualSector).toBeSector(expectedSector);
                }
            }
        });
    });

    describe("TileMatrix degreesPerPixel", function () {

        it("should produce the appropriate resolution for a typical global coverage", function () {
            var sector = Sector.FULL_SPHERE;
            var matrixWidth = 4;
            var matrixHeight = 2;
            var tileWidth = 256;
            var tileHeight = 256;
            var tileMatrix = new TileMatrix(sector, matrixWidth, matrixHeight, tileWidth, tileHeight);
            var expectedResolution = 180 / (matrixHeight * tileHeight);

            var actualResolution = tileMatrix.degreesPerPixel;

            expect(actualResolution).toBe(expectedResolution);
        });

        it("should produce the appropriate resolution for a regional coverage", function () {
            var sector = new Sector(0, 90, 0, 90);
            var matrixWidth = 2;
            var matrixHeight = 2;
            var tileWidth = 256;
            var tileHeight = 256;
            var tileMatrix = new TileMatrix(sector, matrixWidth, matrixHeight, tileWidth, tileHeight);
            var expectedResolution = 90 / (matrixHeight * tileHeight);

            var actualResolution = tileMatrix.degreesPerPixel;

            expect(actualResolution).toBe(expectedResolution);
        });
    });
});
