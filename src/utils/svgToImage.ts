/**
 * SVG to Image Converter
 * Converts SVG elements to PNG images for PDF embedding
 */

/**
 * Convert an SVG element to a base64 PNG data URL
 */
export async function svgToImage(
  svgElement: SVGSVGElement,
  options: {
    width?: number;
    height?: number;
    backgroundColor?: string;
  } = {}
): Promise<string> {
  const { width = 800, height = 600, backgroundColor = '#ffffff' } = options;

  return new Promise((resolve, reject) => {
    try {
      // Clone the SVG to avoid modifying the original
      const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

      // Set explicit dimensions
      clonedSvg.setAttribute('width', width.toString());
      clonedSvg.setAttribute('height', height.toString());

      // Serialize SVG to string
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(clonedSvg);

      // Add XML declaration and namespace if missing
      if (!svgString.includes('xmlns')) {
        svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      // Create a blob URL
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      // Create image element
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Fill background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64
        const dataUrl = canvas.toDataURL('image/png');

        // Cleanup
        URL.revokeObjectURL(url);

        resolve(dataUrl);
      };

      img.onerror = (error) => {
        URL.revokeObjectURL(url);
        reject(new Error(`Failed to load SVG image: ${error}`));
      };

      img.src = url;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Capture a React component's rendered SVG as an image
 * This is useful when the SVG is rendered inside a container
 */
export async function captureRenderedSVG(
  containerElement: HTMLElement,
  options: {
    width?: number;
    height?: number;
    backgroundColor?: string;
  } = {}
): Promise<string> {
  const svgElement = containerElement.querySelector('svg');

  if (!svgElement) {
    throw new Error('No SVG element found in container');
  }

  return svgToImage(svgElement as SVGSVGElement, options);
}

/**
 * Convert base64 data URL to Blob
 */
export function dataURLToBlob(dataURL: string): Blob {
  const parts = dataURL.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}
