export interface AbstractNode {
    tag: string;
    attrs: {
        [key: string]: string;
    };
    children?: AbstractNode[];
}
export interface IconDefinition {
    name: string;
    theme: ThemeType;
    icon: ((primaryColor: string, secondaryColor: string) => AbstractNode) | AbstractNode;
}
export declare type ThemeType = 'fill' | 'outline' | 'twotone';
export interface Manifest {
    fill: string[];
    outline: string[];
    twotone: string[];
}
