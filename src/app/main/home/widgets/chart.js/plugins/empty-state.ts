import { Chart } from 'chart.js';
import { EmptyObject } from 'chart.js/types/basic';

export function emptyState(message: string = 'No data available') {

  return {
    id: 'empty-state',
    afterDraw(chart: Chart, args: EmptyObject, options: any) {
      const {datasets} = chart.data;
      const dataExists = datasets.some((dataset) => {
        return dataset.data && dataset.data.length > 0 && dataset.data.some((i) => i)
      });

      if (dataExists) {return}

      const {chartArea: {left, right, top, bottom}, ctx} = chart

      const centerX = left + right / 2;
      const centerY = top + bottom / 2;

      chart.clear();
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '16px Lato'
      ctx.fillText(message, centerX, centerY);
      ctx.restore();

    }
  }
}
