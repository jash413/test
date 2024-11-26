import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface SpecializedFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (value: string | number) => void;
  error?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

function addCommas(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatDollarValue(val: number): string {
  return `$${addCommas(parseFloat(val.toFixed(2)))}`;
}

function formatPercentageValue(val: number): string {
  return `${(val * 100).toFixed(2)}%`;
}

export const DollarField: React.FC<SpecializedFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  onFocus,
  onBlur
}) => {
  const [displayValue, setDisplayValue] = useState(formatDollarValue(0));

  useEffect(() => {
    setDisplayValue(formatDollarValue(value as number));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9.]/g, '');
    setDisplayValue('$' + addCommas(parseFloat(inputValue) || 0));
    const numericValue = parseFloat(inputValue);
    onChange(isNaN(numericValue) ? 0 : numericValue);
  };

  return (
    <div className="mb-4">
      <Label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        value={displayValue}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={(e) => {
          setDisplayValue(
            formatDollarValue(
              parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0
            )
          );
          onBlur && onBlur(e);
        }}
        className="mt-1 block w-full"
        placeholder="$0.00"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const PercentageField: React.FC<SpecializedFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  onFocus,
  onBlur
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatPercentageValue(Number(value)));
    } else {
      setDisplayValue((Number(value) * 100).toFixed(2));
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9.]/g, '');
    let numericValue = parseFloat(inputValue);

    // Limit to 100
    if (numericValue > 100) {
      numericValue = 100;
    }

    // Ensure only one decimal point
    const parts = inputValue.split('.');
    if (parts.length > 2) {
      numericValue = parseFloat(parts[0] + '.' + parts.slice(1).join(''));
    }

    setDisplayValue(numericValue.toString());
    onChange(numericValue / 100);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setDisplayValue((Number(value) * 100).toFixed(2));
    onFocus && onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const numericValue = parseFloat(displayValue) || 0;
    setDisplayValue(formatPercentageValue(numericValue / 100));
    onChange(numericValue / 100);
    onBlur && onBlur(e);
  };

  return (
    <div className="mb-4">
      <Label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="mt-1 block w-full"
        placeholder="0"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const DateField: React.FC<SpecializedFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  onFocus,
  onBlur
}) => {
  const formatDate = (date: Date): string => {
    return date
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
      .replace(/ /g, '-');
  };

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    // Check if the date is already in ISO format
    if (dateString.includes('T')) {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    }

    // Parse the formatted date string
    const [day, month, year] = dateString.split('-');
    if (!day || !month || !year) return null;

    const monthIndex = getMonthNumber(month);
    if (monthIndex === -1) return null;

    const date = new Date(Number(year), monthIndex, Number(day));
    return isNaN(date.getTime()) ? null : date;
  };

  const getMonthNumber = (month: string): number => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    return months.indexOf(month);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value; // This will be in 'YYYY-MM-DD' format
    const date = new Date(inputDate);
    if (!isNaN(date.getTime())) {
      const formattedDate = formatDate(date);
      onChange(formattedDate);
    } else {
      onChange(''); // or handle invalid date as needed
    }
  };

  // Convert the displayed date format back to 'YYYY-MM-DD' for the input value
  let inputValue = '';
  if (value) {
    const parsedDate = parseDate(value.toString());
    if (parsedDate) {
      inputValue = parsedDate.toISOString().split('T')[0];
    }
  }

  return (
    <div className="mb-4">
      <Label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type="date"
        value={inputValue}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="mt-1 block w-full"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
