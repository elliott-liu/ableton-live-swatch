"use client";
export type Prepend<T extends string, P extends string> = `${P}${T}`;
