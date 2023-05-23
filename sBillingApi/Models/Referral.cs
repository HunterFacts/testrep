using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class Referral
    {
        public Guid Id { get; set; }
        public Guid? Receive { get; set; }
        public Guid? Give { get; set; }

        public virtual Employee GiveNavigation { get; set; }
        public virtual Employee ReceiveNavigation { get; set; }
    }
}
