import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { ResizeObserver } from 'resize-observer';
import App from '../src/App.vue';
import store from "../src/store";
import router from '../src/router';

// Resolves
// ReferenceError: ResizeObserver is not defined
// Which Comes from GChart Package
const ro = ResizeObserver;
global.ResizeObserver = ro;

describe('Header', async () => {
    // https://github.com/vuetifyjs/vuetify/issues/14749#issuecomment-1046878648
    const vuetify = createVuetify({ components, directives });
    const wrapper = mount(App, {
        global: {
            plugins: [vuetify, store, router],
        },
    });
    expect(wrapper).toBeTruthy();
    it('Validates the existence of header', async () => {
        expect(wrapper.html()).toContain('header');
        // Settings Icon
        expect(wrapper.html()).toContain('i');
        // Clear Button
        expect(wrapper.html()).toContain('button');
        // Places Auto Complete
        expect(wrapper.html()).toContain('input');
    });
    it('Opens Settings', async () => {
        
    });
});
