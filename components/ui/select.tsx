import { Check, ChevronDown } from 'lucide-react-native';
import { createContext, useContext, useState } from 'react';
import { Pressable, View } from 'react-native';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectContextValue {
  value?: SelectOption;
  onValueChange?: (option: SelectOption | undefined) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextValue>({
  open: false,
  setOpen: () => {},
});

interface SelectProps {
  value?: SelectOption;
  onValueChange?: (option: SelectOption | undefined) => void;
  children: React.ReactNode;
}

function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <View style={{ zIndex: 50 }}>{children}</View>
    </SelectContext.Provider>
  );
}

function SelectTrigger({
  className,
  children,
  disabled,
}: {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}) {
  const { open, setOpen } = useContext(SelectContext);
  return (
    <Pressable
      className={cn(
        'flex-row h-12 items-center justify-between bg-background px-4',
        'border border-border',
        open ? 'rounded-t-xl border-b-0' : 'rounded-xl',
        disabled && 'opacity-50',
        className
      )}
      onPress={() => !disabled && setOpen(!open)}
      disabled={disabled}
    >
      {children}
      <ChevronDown
        size={16}
        color={open ? THEME.dark.primary : THEME.dark.mutedForeground}
      />
    </Pressable>
  );
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = useContext(SelectContext);
  return (
    <Text className={value ? 'text-foreground text-base' : 'text-muted-foreground text-base'}>
      {value?.label ?? placeholder ?? ''}
    </Text>
  );
}

function SelectContent({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { open } = useContext(SelectContext);
  if (!open) return null;
  return (
    <View
      className={cn(
        'border border-t-0 border-border rounded-b-xl overflow-hidden bg-background',
        className
      )}
    >
      {children}
    </View>
  );
}

function SelectItem({
  className,
  children,
  value,
  label,
  disabled,
}: {
  className?: string;
  children?: React.ReactNode;
  value: string;
  label: string;
  disabled?: boolean;
}) {
  const { value: selected, onValueChange, setOpen } = useContext(SelectContext);
  const isSelected = selected?.value === value;

  return (
    <Pressable
      className={cn(
        'flex-row items-center justify-between px-4 py-4 active:bg-accent',
        disabled && 'opacity-50',
        className
      )}
      onPress={() => {
        if (!disabled) {
          onValueChange?.({ value, label });
          setOpen(false);
        }
      }}
      disabled={disabled}
    >
      <Text
        className={cn(
          'text-foreground text-base',
          isSelected && 'text-primary font-primary-semibold'
        )}
      >
        {children ?? label}
      </Text>
      {isSelected && <Check size={16} color={THEME.dark.primary} />}
    </Pressable>
  );
}

function SelectSeparator({ className }: { className?: string }) {
  return <View className={cn('h-px bg-border', className)} />;
}

function SelectLabel({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <Text className={cn('py-1.5 px-4 text-sm font-primary-semibold text-muted-foreground', className)}>
      {children}
    </Text>
  );
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
