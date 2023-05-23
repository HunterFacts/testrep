using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class Achievement
    {
        public Achievement()
        {
            AchievementOnEmployee = new HashSet<AchievementOnEmployee>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Message { get; set; }
        public string Image { get; set; }

        public virtual ICollection<AchievementOnEmployee> AchievementOnEmployee { get; set; }
    }
}
