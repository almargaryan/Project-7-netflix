import React from 'react';
import { Facebook, Instagram  } from 'lucide-react';

function Footer() {
    return (
        <div className={"footer"}>
            <div className={"footer_media"}>
                <a href="https://www.facebook.com/netflix/"><Facebook fill={"white"}/></a>
                <a href="https://www.instagram.com/Netflix"><Instagram /></a>
            </div>
            <div className={"footer_links"}>
                <div className={"footer_link"}>
                    <a href="https://www.netflix.com/browse/audio-description">Audio Description</a>
                    <a href="https://ir.netflix.com/">Investor Relations</a>
                    <a href="https://help.netflix.com/legal/notices">Legal Notices</a>
                </div>
                <div className={"footer_link"}>
                    <a href="https://help.netflix.com/en/">Help Centre</a>
                    <a href="https://jobs.netflix.com/">Jobs</a>
                    <a href="https://help.netflix.com/legal/privacy#cookies">Cookie Preferences</a>
                </div>
                <div className={"footer_link"}>
                    <a href="https://www.netflix.com/am/redeem">Gift Cards</a>
                    <a href="https://help.netflix.com/legal/termsofuse">Terms Of Use</a>
                    <a href="https://help.netflix.com/en/node/134094">Corporate Information</a>
                </div>
                <div className={"footer_link"}>
                    <a href="https://media.netflix.com/en/">Media Centre</a>
                    <a href="https://help.netflix.com/legal/privacy">Privacy</a>
                    <a href="https://help.netflix.com/en/contactus">Contact Us</a>
                </div>
            </div>
            <div className={"footer_copyright"}>
                © {new Date().getFullYear()} Netflix Clone. All rights reserved.
            </div>
        </div>
    );
}

export default Footer;