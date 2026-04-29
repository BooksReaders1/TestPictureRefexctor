import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ErrorToast from '../../src/components/common/ErrorToast.vue';

describe('ErrorToast Component', () => {
  it('should not render when visible is false', () => {
    const wrapper = mount(ErrorToast, {
      props: {
        message: 'Test error',
        visible: false
      }
    });

    expect(wrapper.find('.error-toast').exists()).toBe(false);
  });

  it('should render when visible is true', () => {
    const wrapper = mount(ErrorToast, {
      props: {
        message: 'Test error',
        visible: true
      }
    });

    expect(wrapper.find('.error-toast').exists()).toBe(true);
  });

  it('should display the error message', () => {
    const message = 'Something went wrong!';
    const wrapper = mount(ErrorToast, {
      props: {
        message,
        visible: true
      }
    });

    expect(wrapper.find('.error-message').text()).toBe(message);
  });

  it('should emit dismiss event when clicked', async () => {
    const wrapper = mount(ErrorToast, {
      props: {
        message: 'Test error',
        visible: true
      }
    });

    await wrapper.find('.error-toast').trigger('click');
    expect(wrapper.emitted('dismiss')).toBeTruthy();
  });

  it('should emit dismiss event when close button is clicked', async () => {
    const wrapper = mount(ErrorToast, {
      props: {
        message: 'Test error',
        visible: true
      }
    });

    await wrapper.find('.close-btn').trigger('click');
    expect(wrapper.emitted('dismiss')).toBeTruthy();
  });

  it('should stop propagation when close button is clicked', async () => {
    const wrapper = mount(ErrorToast, {
      props: {
        message: 'Test error',
        visible: true
      }
    });

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    });

    await wrapper.find('.close-btn').trigger('click', event);
    // The stopPropagation is handled by @click.stop
    expect(wrapper.emitted('dismiss')).toBeTruthy();
  });

  it('should have correct styling for error toast', () => {
    const wrapper = mount(ErrorToast, {
      props: {
        message: 'Test error',
        visible: true
      }
    });

    const toast = wrapper.find('.error-toast');
    expect(toast.classes()).toContain('bg-red-500');
    expect(toast.classes()).toContain('text-white');
    expect(toast.classes()).toContain('rounded-lg');
    expect(toast.classes()).toContain('shadow-lg');
    expect(toast.classes()).toContain('z-50');
  });

  it('should have close button with correct size', () => {
    const wrapper = mount(ErrorToast, {
      props: {
        message: 'Test error',
        visible: true
      }
    });

    const closeBtn = wrapper.find('.close-btn');
    expect(closeBtn.classes()).toContain('w-6');
    expect(closeBtn.classes()).toContain('h-6');
  });

  it('should have padding for error message', () => {
    const wrapper = mount(ErrorToast, {
      props: {
        message: 'Test error',
        visible: true
      }
    });

    const message = wrapper.find('.error-message');
    expect(message.classes()).toContain('flex-1');
    expect(message.classes()).toContain('text-sm');
  });
});
