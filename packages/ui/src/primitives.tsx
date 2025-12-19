import React, { forwardRef } from 'react';

export type StyleProp<T> = T | readonly T[] | undefined;

export interface ViewStyle extends React.CSSProperties {}
export interface TextStyle extends React.CSSProperties {}
export interface ImageStyle extends React.CSSProperties {}
export interface ScrollViewStyle extends React.CSSProperties {}

function flattenStyle<T extends React.CSSProperties>(style?: StyleProp<T>): React.CSSProperties | undefined {
  if (!style) {
    return undefined;
  }
  if (Array.isArray(style)) {
    return style.reduce<React.CSSProperties>((acc, current) => ({ ...acc, ...current }), {});
  }
  return style;
}

export interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
  style?: StyleProp<ViewStyle>;
}

export const View = forwardRef<HTMLDivElement, ViewProps>(function View({ style, ...rest }, ref) {
  return <div ref={ref} style={flattenStyle(style)} {...rest} />;
});

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  style?: StyleProp<TextStyle>;
}

export const Text = forwardRef<HTMLSpanElement, TextProps>(function Text({ style, ...rest }, ref) {
  return <span ref={ref} style={flattenStyle(style)} {...rest} />;
});

export interface ScrollViewProps extends React.HTMLAttributes<HTMLDivElement> {
  style?: StyleProp<ScrollViewStyle>;
}

export const ScrollView = forwardRef<HTMLDivElement, ScrollViewProps>(function ScrollView({ style, ...rest }, ref) {
  return (
    <div
      ref={ref}
      style={{ overflowY: 'auto', ...flattenStyle(style) }}
      {...rest}
    />
  );
});

export interface PressableProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const Pressable = forwardRef<HTMLButtonElement, PressableProps>(function Pressable(
  { style, onPress, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type as 'button' | 'submit' | 'reset'}
      onClick={onPress}
      style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', ...flattenStyle(style) }}
      {...rest}
    />
  );
});

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  style?: StyleProp<ImageStyle>;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image({ style, ...rest }, ref) {
  return <img ref={ref} style={flattenStyle(style)} {...rest} />;
});

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  style?: StyleProp<TextStyle>;
  multiline?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextInputProps>(function TextInput(
  { style, multiline, ...rest },
  ref,
) {
  if (multiline) {
    const { rows = 4, ...textareaRest } = rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    return <textarea ref={ref as React.Ref<HTMLTextAreaElement>} rows={rows} style={flattenStyle(style)} {...textareaRest} />;
  }

  return <input ref={ref as React.Ref<HTMLInputElement>} style={flattenStyle(style)} {...rest} />;
});
