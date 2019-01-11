import bandArithmetic from 'band-arithmetic';
import cache from 'cache';
import histogram from 'histogram';
import identify from 'identify';
import load from 'load';
import max from 'max';
import mean from 'mean';
import median from 'median';
import min from 'min';
import mode from 'mode';
import rasterCalculator from 'raster-calculator';
import sum from 'sum';

const geoblaze = {
  cache,
  bandArithmetic,
  histogram,
  identify,
  load,
  max,
  mean,
  median,
  min,
  mode,
  rasterCalculator,
  sum,
};

export default geoblaze;

export {
  cache,
  bandArithmetic,
  histogram,
  identify,
  load,
  max,
  mean,
  median,
  min,
  mode,
  rasterCalculator,
  sum
};


/* set window.geoblaze in the browser */
if (typeof window !== 'undefined') {
  window['geoblaze'] = geoblaze;
}

/* set self.geoblaze in a web worker */
if (typeof self !== 'undefined') {
  self['geoblaze'] = geoblaze;
}

/* set global.geoblaze in node */
if (typeof global !== 'undefined') {
  global['geoblaze'] = geoblaze;
}
