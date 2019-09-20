import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'arrayToStringWithDelimiter'})
export class ArrayToStringWithDelimiter implements PipeTransform {
  transform(value: string [], delimiter?: string): string {
   return _.join(value, delimiter);
  }
}
