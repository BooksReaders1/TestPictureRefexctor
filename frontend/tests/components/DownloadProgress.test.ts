import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DownloadProgress from '../../src/components/common/DownloadProgress.vue';

describe('DownloadProgress Component', () => {
  it('should not render when visible is false', () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: false,
        progress: 0,
        currentFile: '',
        totalFiles: 0
      }
    });

    expect(wrapper.find('.download-overlay').exists()).toBe(false);
  });

  it('should render when visible is true', () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 50,
        currentFile: 'page-1.jpg',
        totalFiles: 10
      }
    });

    expect(wrapper.find('.download-overlay').exists()).toBe(true);
  });

  it('should display progress percentage', () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 75,
        currentFile: 'page-5.jpg',
        totalFiles: 10
      }
    });

    const progressText = wrapper.find('.progress-text');
    expect(progressText.text()).toBe('75% - page-5.jpg / 10');
  });

  it('should display progress bar width', () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 30,
        currentFile: 'page-3.jpg',
        totalFiles: 10
      }
    });

    const progressFill = wrapper.find('.progress-fill');
    expect(progressFill.attributes('style')).toContain('width: 30%');
  });

  it('should emit close event when close button is clicked', async () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 50,
        currentFile: 'page-5.jpg',
        totalFiles: 10
      }
    });

    await wrapper.find('.close-btn').trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('should emit close event when cancel button is clicked', async () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 50,
        currentFile: 'page-5.jpg',
        totalFiles: 10
      }
    });

    await wrapper.find('.cancel-btn').trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('should emit download event when download button is clicked', async () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 50,
        currentFile: 'page-5.jpg',
        totalFiles: 10
      }
    });

    await wrapper.find('.download-btn').trigger('click');
    expect(wrapper.emitted('download')).toBeTruthy();
  });

  it('should show "正在下载..." message when no error', () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 50,
        currentFile: 'page-5.jpg',
        totalFiles: 10
      }
    });

    const infoText = wrapper.find('.download-info p');
    expect(infoText.text()).toBe('正在下载漫画文件...');
  });

  it('should show error message when error is provided', () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 50,
        currentFile: 'page-5.jpg',
        totalFiles: 10,
        error: '下载失败'
      }
    });

    const errorText = wrapper.find('.error-message');
    expect(errorText.text()).toBe('下载失败');
    expect(errorText.classes()).toContain('text-red-500');
  });

  it('should show "下载完成" message when progress is 100', () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 100,
        currentFile: 'page-10.jpg',
        totalFiles: 10
      }
    });

    const infoText = wrapper.find('.download-info p');
    expect(infoText.text()).toBe('下载完成');
  });

  it('should disable download button when progress is 100', () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 100,
        currentFile: 'page-10.jpg',
        totalFiles: 10
      }
    });

    const downloadBtn = wrapper.find('.download-btn');
    expect(downloadBtn.attributes('disabled')).toBeDefined();
  });

  it('should enable download button when progress is not 100', () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 50,
        currentFile: 'page-5.jpg',
        totalFiles: 10
      }
    });

    const downloadBtn = wrapper.find('.download-btn');
    expect(downloadBtn.attributes('disabled')).toBeUndefined();
  });

  it('should show "开始下载" button text when progress is not 100', () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 50,
        currentFile: 'page-5.jpg',
        totalFiles: 10
      }
    });

    const downloadBtn = wrapper.find('.download-btn');
    expect(downloadBtn.text()).toBe('开始下载');
  });

  it('should show "完成" button text when progress is 100', () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 100,
        currentFile: 'page-10.jpg',
        totalFiles: 10
      }
    });

    const downloadBtn = wrapper.find('.download-btn');
    expect(downloadBtn.text()).toBe('完成');
  });

  it('should handle zero total files', () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 0,
        currentFile: '',
        totalFiles: 0
      }
    });

    const progressText = wrapper.find('.progress-text');
    expect(progressText.text()).toBe('0% -  / 0');
  });

  it('should handle negative progress gracefully', () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: -10,
        currentFile: 'page-1.jpg',
        totalFiles: 10
      }
    });

    const progressFill = wrapper.find('.progress-fill');
    expect(progressFill.attributes('style')).toContain('width: -10%');
  });

  it('should handle progress over 100', () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 120,
        currentFile: 'page-12.jpg',
        totalFiles: 10
      }
    });

    const progressFill = wrapper.find('.progress-fill');
    expect(progressFill.attributes('style')).toContain('width: 120%');
  });

  it('should have correct styling for dialog', () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 50,
        currentFile: 'page-5.jpg',
        totalFiles: 10
      }
    });

    const dialog = wrapper.find('.download-dialog');
    expect(dialog.classes()).toContain('bg-white');
    expect(dialog.classes()).toContain('rounded-2xl');
    expect(dialog.classes()).toContain('shadow-2xl');
  });

  it('should have correct styling for progress bar', () => {
    const wrapper = mount(DownloadProgress, {
      props: {
        visible: true,
        progress: 50,
        currentFile: 'page-5.jpg',
        totalFiles: 10
      }
    });

    const progressContainer = wrapper.find('.progress-container');
    expect(progressContainer.classes()).toContain('mb-6');
  });
});
