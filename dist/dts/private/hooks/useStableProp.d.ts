/**
 * Returns a referentially-stable copy of `value` as long as the structural
 * content stays the same. Lets consumers pass inline SDK class instances
 * (`new Brush(...)`, `new TorchSwitchControl()`) or plain options objects
 * without memoizing — the effect deps array sees the same reference until
 * the underlying content actually changes.
 *
 * SDK classes that extend `DefaultSerializeable` are compared via their
 * `toJson()` output (which respects `@ignoreFromSerialization`), so private
 * back-refs like `view` don't cause spurious diffs. Plain objects and arrays
 * are compared via direct `JSON.stringify`.
 *
 * ```tsx
 * function MyView({ brush }: { brush?: Brush | null }) {
 *   const stableBrush = useStableProp(brush);
 *   useEffect(() => {
 *     if (stableBrush) overlay.brush = stableBrush;
 *   }, [stableBrush]);
 * }
 * ```
 */
export declare function useStableProp<T>(value: T): T;
