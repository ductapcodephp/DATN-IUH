import React from "react";

export default function HtmlRaw({ block }) {
    // HTML raw should not be inline editable, it's just raw HTML
    return (
        <div dangerouslySetInnerHTML={{ __html: block?.content || '' }}></div>
    );
}
