using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class AchievementOnEmployee
    {
        public Guid Id { get; set; }
        public Guid? Achievement { get; set; }
        public Guid? Employee { get; set; }
        public bool? Active { get; set; }
        public DateTime? Date { get; set; }

        public virtual Achievement AchievementNavigation { get; set; }
        public virtual Employee EmployeeNavigation { get; set; }
    }
}
