using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace sBillingApi.Models
{
    public partial class Room
    {
        public Room()
        {
            RoomOnWorkshift = new HashSet<RoomOnWorkshift>();
        }

        public Guid Id { get; set; }
        public int? NumberRoom { get; set; }
        public Guid? House { get; set; }

        public virtual House HouseNavigation { get; set; }
        public virtual ICollection<RoomOnWorkshift> RoomOnWorkshift { get; set; }
    }
}
