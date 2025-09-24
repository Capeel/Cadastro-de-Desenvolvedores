import React, { useState } from 'react';
import { FormControl, FormLabel, Input, InputProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionFormLabel = motion(FormLabel);

interface AnimatedInputProps extends InputProps {
  label: string;
  marginTop?: string;
  focusColor?: string;
  labelColor?: string;
}

export const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(({
  label,
  value,
  onChange,
  marginTop = "20px",
  focusColor = "blue.500",
  labelColor = "gray.500",
  ...inputProps
}, ref) => {
  const [isFocus, setIsFocus] = useState(false);
  const inputValue = value || inputProps.defaultValue || '';

  return (
    <FormControl position="relative" variant="flushed" marginTop={marginTop}>
      <MotionFormLabel
        position="absolute"
        top={isFocus || inputValue ? "-4" : "3"}
        left="3"
        fontSize={isFocus || inputValue ? "lg" : "lg"}
        color={isFocus ? focusColor : labelColor}
        initial={false}
        animate={{
          top: isFocus || inputValue ? -20 : 12,
          fontSize: isFocus || inputValue ? "1rem" : "1rem",
          color: isFocus ? "#2D3748" : "#2D3748"
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </MotionFormLabel>
      <Input
        ref={ref}
        value={value || ''}
        onChange={onChange}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        paddingLeft="2"
        variant="flushed"
        {...inputProps}
      />
    </FormControl>
  );
});

AnimatedInput.displayName = 'AnimatedInput';