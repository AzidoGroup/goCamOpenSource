namespace Avs {

  export namespace Helper {

    export class ElementPositionCalculator {

      public static getScreenPositionFromConfig(elementConfig: IContainerConfig) {

        const bodyElement = $(window);

        const screenWidth  = bodyElement.width();
        const screenHeight = bodyElement.height();

        if (screenWidth - elementConfig.boundary.left - elementConfig.boundary.right > elementConfig.maxWidth) {
          const horizontalBoundary       = (screenWidth - elementConfig.maxWidth) / 2;
          elementConfig.boundary.left  = horizontalBoundary;
          elementConfig.boundary.right = horizontalBoundary;
        }

        if (screenHeight - elementConfig.boundary.top - elementConfig.boundary.bottom > elementConfig.maxHeight) {
          const verticalBoundary          = (screenHeight - elementConfig.maxHeight) / 2;
          elementConfig.boundary.bottom = verticalBoundary + verticalBoundary - elementConfig.boundary.top;
        }

        const maxWidth  = screenWidth - elementConfig.boundary.left - elementConfig.boundary.right;
        const maxHeight = screenHeight - elementConfig.boundary.top - elementConfig.boundary.bottom;

        const maxAspectRatio = maxWidth / maxHeight;
        const aspectRatio    = elementConfig.width / elementConfig.height;

        let finalWidth  = elementConfig.width;
        let finalHeight = elementConfig.height;
        const finalTop    = elementConfig.boundary.top;
        let finalBottom = elementConfig.boundary.bottom;
        let finalLeft   = elementConfig.boundary.left;
        let finalRight  = elementConfig.boundary.right;
        let scaleRatio  = 1;

        // maxWidth ratio greater than elementWidth ratio
        if (maxAspectRatio > aspectRatio) {

          scaleRatio = maxHeight / elementConfig.height;

          finalHeight = maxHeight;
          finalWidth  = elementConfig.width * scaleRatio;

          const widthDiff = (maxWidth - finalWidth) / 2;
          finalLeft += widthDiff;
          finalRight += widthDiff;

        }
        else {

          scaleRatio = maxWidth / elementConfig.width;

          finalWidth  = maxWidth;
          finalHeight = elementConfig.height * scaleRatio;

          const heightDiff = (maxHeight - finalHeight) / 2;

          // uncomment if you want vertical centering of the container
          // finalTop += heightDiff;
          // finalBottom += heightDiff;

          finalBottom += heightDiff * 2;

        }

        return {
          screenWidth : screenWidth,
          screenHeight: screenHeight,
          width       : finalWidth,
          height      : finalHeight,
          top         : finalTop,
          bottom      : finalBottom,
          left        : finalLeft,
          right       : finalRight,
          scaleRatio  : scaleRatio
        };

      }

      public static getScreenPositionRelativeToContainer(containerConfig: IContainerConfig, elementConfig: IRelativeContainerConfig) {

        const containerScreenPosition = Avs.Helper.ElementPositionCalculator.getScreenPositionFromConfig(containerConfig);

        const screenWidth  = containerScreenPosition.screenWidth;
        const screenHeight = containerScreenPosition.screenHeight;

        const finalWidth  = elementConfig.width * containerScreenPosition.scaleRatio;
        const finalHeight = elementConfig.height * containerScreenPosition.scaleRatio;
        const finalTop    = containerScreenPosition.top + (elementConfig.top * containerScreenPosition.scaleRatio);
        const finalBottom = screenHeight - finalHeight - finalTop;
        const finalLeft   = containerScreenPosition.left + (elementConfig.left * containerScreenPosition.scaleRatio);
        const finalRight  = screenWidth - finalWidth - finalLeft;
        const scaleRatio  = containerScreenPosition.scaleRatio;

        return {
          screenWidth : screenWidth,
          screenHeight: screenHeight,
          width       : finalWidth,
          height      : finalHeight,
          top         : finalTop,
          bottom      : finalBottom,
          left        : finalLeft,
          right       : finalRight,
          scaleRatio  : scaleRatio
        };

      }

      public static calculateBirthDateMaskPosition(faceCoordinates: Avs.Plugin.Library.Ml.IFaceCoordinates, idSizeConfig: Avs.Entity.IIdSizeItem) {

        let faceDimensionRatio = faceCoordinates.width / idSizeConfig.faceArea.width;
        // allow up to 20% random position
        if (Math.random() > 0.5) {
          faceDimensionRatio += faceDimensionRatio * Math.random() / 5;
        }
        else {
          faceDimensionRatio -= faceDimensionRatio * Math.random() / 5;
        }

        return {
          top         : faceCoordinates.top + (idSizeConfig.faceArea.birthDateAreaDistance.top * faceDimensionRatio),
          left        : faceCoordinates.left + (idSizeConfig.faceArea.birthDateAreaDistance.left * faceDimensionRatio),
          width       : idSizeConfig.birthDateArea.width * faceDimensionRatio,
          height      : idSizeConfig.birthDateArea.height * faceDimensionRatio,
          scalePercent: faceDimensionRatio
        };

      }

      public static applyPositioning(element: any, positioning: any) {


        $(element).css({
          //position: 'fixed',
          //border  : 'solid',
          width   : positioning.width,
          height  : positioning.height,
          top     : positioning.top,
          left    : positioning.left,
        });

      }

    }

    export interface IContainerConfig {
      width: number,
      height: number,
      maxWidth: number,
      maxHeight: number,
      boundary: {
        top: number,
        bottom: number,
        left: number,
        right: number
      }
    }

    export interface IRelativeContainerConfig {
      width: number,
      height: number,
      top: number,
      left: number
    }

  }

}
