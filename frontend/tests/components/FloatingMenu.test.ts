import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import FloatingMenu from '../../src/components/common/FloatingMenu.vue';

describe('FloatingMenu Component', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    // Mock router
    vi.mock('vue-router', () => ({
      useRouter: () => ({
        push: vi.fn()
      })
    }));

    wrapper = mount(FloatingMenu, {
      props: {
        currentChapter: { id: 'chapter-1', title: 'Chapter 1' }
      }
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render menu button', () => {
      expect(wrapper.find('.menu-button').exists()).toBe(true);
    });

    it('should render menu drawer when visible', () => {
      wrapper.vm.visible = true;
      wrapper.update();
      expect(wrapper.find('.menu-drawer').exists()).toBe(true);
    });

    it('should not render menu drawer when invisible', () => {
      expect(wrapper.find('.menu-drawer').exists()).toBe(false);
    });

    it('should have correct menu items', async () => {
      wrapper.vm.visible = true;
      await wrapper.vm.$nextTick();

      const items = wrapper.findAll('.menu-item');
      expect(items.length).toBe(3);
      expect(items[0].text()).toContain('下载章节');
      expect(items[1].text()).toContain('设置');
      expect(items[2].text()).toContain('返回首页');
    });
  });

  describe('Menu Toggle', () => {
    it('should toggle menu visibility when menu button is clicked', async () => {
      expect(wrapper.vm.visible).toBe(false);
      await wrapper.find('.menu-button').trigger('click');
      expect(wrapper.vm.visible).toBe(true);
    });

    it('should toggle menu visibility when close button is clicked', async () => {
      wrapper.vm.visible = true;
      await wrapper.update();
      await wrapper.find('.close-btn').trigger('click');
      expect(wrapper.vm.visible).toBe(false);
    });

    it('should open menu when clicking menu button', async () => {
      await wrapper.find('.menu-button').trigger('click');
      expect(wrapper.vm.visible).toBe(true);
    });
  });

  describe('Menu Actions', () => {
    it('should emit download event when download item is clicked', async () => {
      wrapper.vm.visible = true;
      await wrapper.update();

      const downloadItem = wrapper.findAll('.menu-item')[0];
      await downloadItem.trigger('click');

      expect(wrapper.emitted('download')).toBeTruthy();
      expect(wrapper.emitted('download')![0]).toEqual([{ id: 'chapter-1', title: 'Chapter 1' }]);
    });

    it('should log settings action (console)', async () => {
      wrapper.vm.visible = true;
      await wrapper.update();

      const settingsItem = wrapper.findAll('.menu-item')[1];
      await settingsItem.trigger('click');

      expect(wrapper.vm.visible).toBe(false);
    });

    it('should navigate to home when home item is clicked', async () => {
      const mockPush = vi.fn();
      (import('vue-router')).useRouter = () => ({ push: mockPush });

      wrapper.vm.visible = true;
      await wrapper.update();

      const homeItem = wrapper.findAll('.menu-item')[2];
      await homeItem.trigger('click');

      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should trigger menu item click on Enter key', async () => {
      wrapper.vm.visible = true;
      await wrapper.update();

      const downloadItem = wrapper.findAll('.menu-item')[0];
      await downloadItem.trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('download')).toBeTruthy();
    });

    it('should trigger menu item click on Space key', async () => {
      wrapper.vm.visible = true;
      await wrapper.update();

      const downloadItem = wrapper.findAll('.menu-item')[0];
      await downloadItem.trigger('keydown', { key: ' ' });

      expect(wrapper.emitted('download')).toBeTruthy();
    });
  });

  describe('Current Chapter', () => {
    it('should only show download item when currentChapter is provided', () => {
      wrapper = mount(FloatingMenu, {
        props: { currentChapter: { id: 'chapter-1', title: 'Chapter 1' } }
      });

      expect(wrapper.vm.currentChapter).toBeTruthy();
    });

    it('should handle missing currentChapter', () => {
      wrapper = mount(FloatingMenu, {
        props: { currentChapter: undefined }
      });

      wrapper.vm.visible = true;
      wrapper.vm.$nextTick();

      const items = wrapper.findAll('.menu-item');
      // Should only have 2 items (no download)
      expect(items.length).toBe(2);
    });
  });

  describe('Close Menu on Outside Click', () => {
    it('should close menu when clicking outside', async () => {
      wrapper.vm.visible = true;
      await wrapper.update();

      const mockEvent = new MouseEvent('click');
      document.dispatchEvent(mockEvent);

      expect(wrapper.vm.visible).toBe(false);
    });
  });

  describe('Styling', () => {
    it('should have correct styles for menu button', () => {
      const menuButton = wrapper.find('.menu-button');
      expect(menuButton.classes()).toContain('rounded-full');
      expect(menuButton.classes()).toContain('flex');
      expect(menuButton.classes()).toContain('items-center');
      expect(menuButton.classes()).toContain('justify-center');
    });

    it('should have correct styles for menu drawer', () => {
      wrapper.vm.visible = true;
      wrapper.vm.$nextTick();

      const drawer = wrapper.find('.menu-drawer');
      expect(drawer.classes()).toContain('bg-white');
      expect(drawer.classes()).toContain('rounded-xl');
      expect(drawer.classes()).toContain('shadow-lg');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      wrapper.vm.visible = true;
      wrapper.vm.$nextTick();

      const drawer = wrapper.find('.menu-drawer');
      expect(drawer.attributes('role')).toBe('dialog');
      expect(drawer.attributes('aria-label')).toBe('主菜单');
    });

    it('should have menu items with menuitem role', () => {
      wrapper.vm.visible = true;
      wrapper.vm.$nextTick();

      const items = wrapper.findAll('.menu-item');
      items.forEach(item => {
        expect(item.attributes('role')).toBe('menuitem');
        expect(item.attributes('tabindex')).toBe('0');
      });
    });
  });
});
