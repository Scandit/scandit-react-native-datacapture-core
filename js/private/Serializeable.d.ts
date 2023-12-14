export interface Serializeable {
    toJSON: () => object;
}
export interface StringSerializeable {
    toJSON: () => string;
}
export declare function ignoreFromSerialization(target: any, propertyName: string): void;
export declare function nameForSerialization(customName: string): (target: any, propertyName: string) => void;
export declare function ignoreFromSerializationIfNull(target: any, propertyName: string): void;
export declare function serializationDefault(defaultValue: any): (target: any, propertyName: string) => void;
export declare class DefaultSerializeable implements Serializeable {
    toJSON(): object;
}
