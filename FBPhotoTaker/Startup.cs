using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(FBPhotoTaker.Startup))]
namespace FBPhotoTaker
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
