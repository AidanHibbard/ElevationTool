import { mount } from '@vue/test-utils'
import { test, describe, expect } from 'vitest';
import App from '../src/App.vue'

test('App', async () => {
    expect(App).toBeTruthy();
    const wrapper = mount(App);
    describe('Verify App', () => {
        expect(wrapper.isVueInstance()).toBeTruthy();
    });
    describe('NavBar', () => {
        // Clear markers
        expect(wrapper.contains("button")).toBeTruthy();
        // Places input
        expect(wrapper.contains("input")).toBeTruthy();
    });
    describe('Miles', () => {
        describe('Default text', () => {
            expect(wrapper.text()).toContain('0 Miles');
            expect(wrapper.text()).toContain('0 ft Elevation change');
            expect(wrapper.text()).toContain('Legend: 1%3%6%9%> 9%');
            expect(wrapper.text()).toContain('Drop a couple pins to get started');
        });
        describe('Map', () => {
            expect(wrapper.contains("iframe")).toBeTruthy();
        });
        describe('Add markers', () => {
            wrapper.vm.addMarker({ lat: 45.55185999174857, lng: 14.724517492065416 });
            wrapper.vm.addMarker({ lat: 45.54705145892176, lng: 14.710784581909166 });
            expect(wrapper.vm.$data.markers.length).is(2);
            describe('Correct transformation', () => {
                expect(wrapper.text()).toContain('2.49 Miles');
                expect(wrapper.text()).toContain('1292 ft elevation change');
                expect(wrapper.text()).toContain('9.80% grade avg');
                expect(wrapper.text()).toContain('Click along the chart line to drop a pin');
                expect(wrapper.contains("rect")).toBeTruthy();
            });
        });
        describe('Clear markers', async () => {
            await wrapper.get('button').trigger('click');
            expect(wrapper.vm.$data.markers.length).is(0);
            expect(wrapper.text()).toContain('0 Miles');
            expect(wrapper.text()).toContain('0 ft elevation change');
            expect(wrapper.text()).toContain('0% grade avg');
            expect(wrapper.text()).toContain('Drop a couple pins to get started');
            expect(wrapper.contains("rect")).toBeFalsy();
        });
    });
    
});