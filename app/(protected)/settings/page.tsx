import { useEffect, useState } from "react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settingGeneral, setSettingGeneral] = useState<Pa | null>(null);

  useEffect

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">General Settings</h3>
      </div>
    </div>
  )
};

export default SettingsPage
