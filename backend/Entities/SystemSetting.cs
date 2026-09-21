namespace GovPortal.API.Entities
{
    public class SystemSetting : BaseEntity
    {
        public string SettingKey { get; set; } = string.Empty;
        public string SettingValue { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
