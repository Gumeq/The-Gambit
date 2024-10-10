import React from "react";

interface CategoryButtonProps {
  selected: boolean;
  iconFill: React.ComponentType<{ className: string }>;
  iconOutline: React.ComponentType<{ className: string }>;
  label: string;
  onClick: () => void; // Add onClick prop
}

const CategoryButton = ({
  selected,
  iconFill: IconFill,
  iconOutline: IconOutline,
  label,
  onClick,
}: CategoryButtonProps) => {
  return (
    <button
      onClick={onClick} // Handle the click
      className={`flex w-max flex-row items-center gap-2 rounded-lg bg-foreground/5 p-2 pr-4`}
    >
      {selected ? (
        <IconFill className="h-6 w-6 text-primary" />
      ) : (
        <IconOutline className="h-6 w-6 text-foreground/50" />
      )}
      <div>{label}</div>
    </button>
  );
};

export default CategoryButton;
