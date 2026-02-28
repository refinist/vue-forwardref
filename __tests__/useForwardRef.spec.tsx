import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, ref, type ComponentPublicInstance } from 'vue';
import { useForwardRef } from '../src/index';

type ChildExpose = {
  foo: number;
  bar: number;
  handleAddBar: () => void;
};

const Child = defineComponent({
  setup(_, { expose }) {
    const foo = 0;
    const bar = ref(1);
    const handleAddBar = () => {
      bar.value++;
    };
    expose({
      foo,
      bar,
      handleAddBar
    });
    return () => <div>Child {{ bar }}</div>;
  }
});

describe('useForwardRef', () => {
  it('parent instance receives child exposed API when forwarding ref via useForwardRef', () => {
    type ChildInstance = ComponentPublicInstance<{}, ChildExpose>;

    const Parent = defineComponent({
      components: { Child },
      setup() {
        const { forwardRef } = useForwardRef();
        return () => <Child ref={forwardRef} />;
      }
    });

    const wrapper = mount(Parent);
    const vm = wrapper.vm as unknown as ChildInstance;
    expect(vm.foo).toBe(0);
    expect(vm.bar).toBe(1);
    expect(vm.handleAddBar).toBeDefined();

    vm.handleAddBar();
    expect(vm.bar).toBe(2);
  });

  it('parent instance has both child exposed and useForwardRef(ext) merged', () => {
    const Parent = defineComponent({
      components: { Child },
      setup() {
        const parentFoo = 0;
        const parentBar = ref(1);

        const { forwardRef } = useForwardRef({
          parentFoo,
          parentBar
        });
        return () => <Child ref={forwardRef} />;
      }
    });
    type ParentExpose = {
      parentFoo: number;
      parentBar: number;
    };

    type ParentInstance = ComponentPublicInstance<
      {},
      ChildExpose & ParentExpose
    >;

    const wrapper = mount(Parent);
    const vm = wrapper.vm as unknown as ParentInstance;

    expect(vm.parentFoo).toBe(0);
    expect(vm.parentBar).toBe(1);

    expect(vm.foo).toBe(0);
    expect(vm.bar).toBe(1);
    expect(vm.handleAddBar).toBeDefined();

    vm.handleAddBar();
    expect(vm.bar).toBe(2);
  });

  it('handles forwardRef called with null (e.g. on unmount)', () => {
    const Parent = defineComponent({
      components: { Child },
      setup() {
        const { forwardRef } = useForwardRef();
        return () => <Child ref={forwardRef} />;
      }
    });

    const wrapper = mount(Parent);
    const vm = wrapper.vm as unknown as ChildExpose;
    expect(vm.foo).toBe(0);

    // Unmount triggers ref callback with null
    wrapper.unmount();
    // Should not throw; forwardRef(null) uses originRef || {}
  });
});
