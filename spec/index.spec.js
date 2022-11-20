import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import { ResizeObserver } from 'resize-observer';
import App from '../src/App.vue';
import store from "../src/store";

// Resolves
// ReferenceError: ResizeObserver is not defined
// Which Comes from GChart Package
const ro = ResizeObserver;
global.ResizeObserver = ro;

// Minimal Components so
// Only testing ElevationTool from App
// Keep it simple
describe('App Testing', () => {
    // https://github.com/vuetifyjs/vuetify/issues/14749#issuecomment-1046878648
    const vuetify = createVuetify({ components, directives });
    const wrapper = mount(App, {
            global: {
                plugins: [vuetify, store],
            },
        }
    );
    it('Verifies App', () => {
        expect(wrapper).toBeTruthy;
    });

});