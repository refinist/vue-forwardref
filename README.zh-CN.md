# vue-use-forward-ref

[![npm](https://img.shields.io/npm/v/vue-use-forward-ref.svg?colorA=42b883&colorB=35495e)](https://npmjs.com/package/vue-use-forward-ref) [![Unit Test](https://img.shields.io/github/actions/workflow/status/refinist/vue-use-forward-ref/unit-test.yml?colorA=42b883&colorB=35495e&label=Unit%20Test)](https://github.com/refinist/vue-use-forward-ref/actions/workflows/unit-test.yml) [![codecov](https://img.shields.io/codecov/c/github/refinist/vue-use-forward-ref?colorA=42b883&colorB=35495e)](https://codecov.io/github/refinist/vue-use-forward-ref) [![size](https://img.badgesize.io/https://unpkg.com/vue-use-forward-ref?compression=gzip&labelColor=42b883&color=35495e)](https://unpkg.com/vue-use-forward-ref)

[English](README.md) | 中文

轻量级 Vue 3 组合式 API，用于转发组件 ref，并将子组件的暴露 API 合并到父实例上。父级 ref 会同时暴露子组件的 `expose()` 以及可选的额外字段，统一在一处访问。

## 特性

- **轻量** – 零依赖，体积小
- **类型安全** – 完整 TypeScript 支持
- **简单 API** – `useForwardRef(ext?)` 返回 `{ forwardRef }`，传给子组件的 `ref` 即可
- **与 ext 合并** – 可选地将额外字段合并到父级暴露对象上

## 安装

```bash
# npm
npm install vue-use-forward-ref

# yarn
yarn add vue-use-forward-ref

# pnpm
pnpm add vue-use-forward-ref

# bun
bun add vue-use-forward-ref
```

## 基本用法

### 将子组件 ref 转发给父级

将 `forwardRef` 作为子组件的 `ref` 使用。父级（例如祖父组件）的 ref 会收到子组件的暴露 API。

```vue
<!-- Wrapper.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useForwardRef } from 'vue-use-forward-ref';
import Child from './Child.vue';

const { forwardRef } = useForwardRef();
</script>

<template>
  <Child :ref="forwardRef" />
</template>
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import type Child from './Child.vue';

const wrapperRef = useTemplateRef<InstanceType<typeof Child>>('wrapperRef');
</script>

<template>
  <Wrapper ref="wrapperRef" />
</template>
```

### 合并额外字段

可以将额外字段合并到暴露对象上，使父级 ref 既能访问子组件的 API，也能访问你传入的额外数据。

```ts
// types.ts
import type { Ref } from 'vue';
import type Child from './Child.vue';

export type WrapperExpose = {
  count: Ref<number>;
  reset: () => void;
};
export type WrapperInstance = InstanceType<typeof Child> & WrapperExpose;
```

```vue
<!-- Wrapper.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useForwardRef } from 'vue-use-forward-ref';
import Child from './Child.vue';
import type { WrapperExpose } from './types';

const count = ref(0);
const { forwardRef } = useForwardRef<WrapperExpose>({
  count,
  reset: () => {
    count.value = 0;
  }
});
</script>

<template>
  <Child :ref="forwardRef" />
</template>
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import type { WrapperInstance } from './types';
const wrapperRef = useTemplateRef<WrapperInstance>('wrapperRef');
</script>

<template>
  <Wrapper ref="wrapperRef" />
</template>
```

## 许可证

[MIT](./LICENSE)

Copyright (c) 2026-present REFINIST
