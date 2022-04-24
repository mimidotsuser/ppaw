import { randomInt } from '../../../../utils/utils';
import { Color } from 'chart.js';

const baseColors: Array<number[]> = [
  [255, 99, 132],
  [54, 162, 235],
  [255, 206, 86],
  [231, 233, 237],
  [75, 192, 192],
  [151, 187, 205],
  [220, 220, 220],
  [247, 70, 74],
  [70, 191, 189],
  [253, 180, 92],
  [148, 159, 177],
  [77, 83, 96]
];

export const BaseDefaults = {
  datasets: {
    line: {
      backgroundColor: (context: any) => rgba(generateColor(context.datasetIndex), 0.4),
      borderColor: (context: any) => rgba(generateColor(context.datasetIndex), 1),
      pointBackgroundColor: (context: any) => rgba(generateColor(context.datasetIndex), 1),
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: (context: any) => rgba(generateColor(context.datasetIndex), 0.8),
    },
    doughnut: {
      backgroundColor: (context: any) => rgba(generateColor(context.dataIndex), 0.6),
      borderColor: '#fff',
      hoverBackgroundColor: (context: any) => rgba(generateColor(context.dataIndex), 1),
      hoverBorderColor: (context: any) => rgba(generateColor(context.dataIndex), 1)
    },
    get pie(): { [ key: string ]: ((context: any) => Color) | Color } {
      return this.doughnut;
    }
  }
}


function rgba(colour: Array<number>, alpha: number): Color {
  return 'rgba(' + colour.concat(alpha).join(',') + ')';
}

function randomColor(): number[] {
  return [randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)];
}

function generateColor(index = 0): number[] {
  return baseColors[ index ] || randomColor();
}
