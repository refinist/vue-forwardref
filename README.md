# vue-use-forward-ref

[![npm](https://img.shields.io/npm/v/vue-use-forward-ref.svg?colorA=42b883&colorB=35495e)](https://npmjs.com/package/vue-use-forward-ref) [![Unit Test](https://img.shields.io/github/actions/workflow/status/refinist/vue-use-forward-ref/unit-test.yml?colorA=42b883&colorB=35495e&label=Unit%20Test)](https://github.com/refinist/vue-use-forward-ref/actions/workflows/unit-test.yml) [![codecov](https://img.shields.io/codecov/c/github/refinist/vue-use-forward-ref?colorA=42b883&colorB=35495e)](https://codecov.io/github/refinist/vue-use-forward-ref) [![size](https://img.badgesize.io/https://unpkg.com/vue-use-forward-ref?compression=gzip&labelColor=42b883&color=35495e)](https://unpkg.com/vue-use-forward-ref)

A lightweight Vue 3 composable to forward component ref and merge the child's exposed API onto the parent instance. Parent's ref then exposes both the child's `expose()` and optional extra fields in one place.

## ✨ Features

- **Lightweight** – Zero dependencies, minimal footprint
- **Type Safe** – Full TypeScript support
- **Simple API** – `useForwardRef(ext?)` returns `{ forwardRef }`, pass it to child's `ref`
- **Merge with ext** – Optionally merge extra fields onto the parent's exposed object

## 📦 Installation

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

## 🚀 Basic Usage

### Forward child ref to parent

Use `forwardRef` as the child's `ref`. The parent's ref (e.g. from a grandparent) will then receive the child's exposed API.

```vue
<template>
  <Child ref="forwardRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useForwardRef } from 'vue-use-forward-ref';
import Child from './Child.vue';

const { forwardRef } = useForwardRef();
</script>
```

When a parent mounts this component with `<Wrapper ref="parentRef" />`, `parentRef` will expose the same API as `Child` (whatever `Child` passed to `expose()`).

### Merge extra fields with `useForwardRef(ext)`

You can merge additional fields onto the exposed object so the parent ref sees both the child's API and your extra data.

```vue
<template>
  <Child ref="forwardRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useForwardRef } from 'vue-use-forward-ref';
import Child from './Child.vue';

const count = ref(0);
const { forwardRef } = useForwardRef({
  count,
  reset: () => {
    count.value = 0;
  }
});
</script>
```

The parent's ref will then have both `Child`'s exposed API and `count` / `reset`.

## 📚 API

### `useForwardRef<E>(ext?: E)`

Must be called in a component's `setup()` (uses `getCurrentInstance()`).

**Parameters:**

- `ext` (optional) – Object to merge onto the current component's `exposed` / `exposeProxy`. When the ref callback runs (child mounted), both the child instance (or element) and `ext` are assigned onto the current instance's exposed object.

**Returns:**

```ts
{ forwardRef: (originRef: OriginRef) => void }
```

- `forwardRef` – Ref callback. Use it as the child's `ref` (e.g. `ref="forwardRef"` or `:ref="forwardRef"`). When the child is mounted, `originRef` is the child instance or DOM element; when unmounted, it is `null`. The current component's exposed object is updated so that the parent's ref sees the merged API.

**Types:**

- `OriginRef = Element | ComponentPublicInstance | null`

## 📄 License

[MIT](./LICENSE)

Copyright (c) 2025-present REFINIST
