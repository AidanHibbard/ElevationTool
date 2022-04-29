import sample_response from './samples/response_sample.js';
import sample_results from './samples/results_sample.js'
import sample_table from './samples/table_sample.js'
import sample_locs from './samples/locs_sample.js'
import { computeDistance, createTable } from '@/utils';
import { test, describe, expect } from 'vitest';

/*
A good way to record samples
    window.open(
        "data:text/json," + encodeURIComponent(JSON.stringify(results)),
        "_blank"
    );
*/

test('Utils', () => {
    describe('Computing route distance', () => {
        const distance = computeDistance(sample_response);
        expect(distance).toEqual('2.42')
    });
    describe('Create table and locations', () => {
        const etl = createTable(sample_results);
        expect(etl.dataTable).toEqual(sample_table);
        expect(etl.locs).toEqual(sample_locs);
    });
});