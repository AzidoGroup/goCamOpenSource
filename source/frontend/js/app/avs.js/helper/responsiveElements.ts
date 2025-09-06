namespace Avs {

  export namespace Helper {

    export class ResponsiveElements {

      public static readonly DEVICE_ORIENTATION_LANDSCAPE = 'landscape';
      public static readonly DEVICE_ORIENTATION_PORTRAIT  = 'portrait';

      public static getDeviceOrientation() {

        const documentElement = $(document);
        const width           = documentElement.width();
        const height          = documentElement.height();

        return width / height > 1
          ? ResponsiveElements.DEVICE_ORIENTATION_LANDSCAPE
          : ResponsiveElements.DEVICE_ORIENTATION_PORTRAIT;

      }

    }
  }
}
