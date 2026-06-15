import { Switch, Typography } from 'antd';

type PrefillToggleProps = {
  isEnabled: boolean;
  onChange: (checked: boolean) => void;
};

/** Header toggle that enables/disables prefill mapping for a form's fields. */
export function PrefillToggle({ isEnabled, onChange }: PrefillToggleProps) {
  return (
    <div className='prefill-toggle'>
      <div className='prefill-toggle__text'>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Prefill
        </Typography.Title>
        <Typography.Text type='secondary'>
          Prefill fields for this form
        </Typography.Text>
      </div>
      <Switch checked={isEnabled} onChange={onChange} />
    </div>
  );
}
