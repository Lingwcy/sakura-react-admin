// SomePage.tsx
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import IconifySelectDialog from '@/components/icon-select-panel';

const SomePage: React.FC = () => {
  const [icon, setIcon] = useState('mdi:home');
  const [open, setOpen] = useState(false);

  return (
    <div className="p-10 space-y-4">
      <p>当前图标：</p>
      <div
        className="w-14 h-14 border rounded flex items-center justify-center cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Icon icon={icon} width={32} height={32} />
      </div>

      <IconifySelectDialog
        open={open}
        onOpenChange={setOpen}
        onSelect={(name) => setIcon(name)}
      />
    </div>
  );
};

export default SomePage;