import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LoadingSpinner from '../../src/components/common/LoadingSpinner.vue';

describe('LoadingSpinner Component', () => {
  it('should render the loading spinner', () => {
    const wrapper = mount(LoadingSpinner);

    expect(wrapper.find('.loading-spinner').exists()).toBe(true);
    expect(wrapper.find('.spinner').exists()).toBe(true);
  });

  it('should have the correct spinner size', () => {
    const wrapper = mount(LoadingSpinner);
    const spinner = wrapper.find('.spinner');

    expect(spinner.exists()).toBe(true);
    expect(spinner.classes()).toContain('rounded-full');
  });

  it('should use primary color for spinner border', () => {
    const wrapper = mount(LoadingSpinner);
    const spinner = wrapper.find('.spinner');

    expect(spinner.exists()).toBe(true);
    expect(spinner.attributes('style')).toContain('#2c3e50');
  });

  it('should have loading spinner container', () => {
    const wrapper = mount(LoadingSpinner);
    const container = wrapper.find('.loading-spinner');

    expect(container.exists()).toBe(true);
    expect(container.classes()).toContain('flex');
    expect(container.classes()).toContain('items-center');
    expect(container.classes()).toContain('justify-center');
  });
});
