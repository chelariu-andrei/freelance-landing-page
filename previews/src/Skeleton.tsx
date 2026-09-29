import * as React from "react";
import { Skeleton } from "ac";
import { mount } from "./_data";
mount(
  <div className="ac-root bg-white p-6 rounded-lg flex items-center gap-4">
    <Skeleton shape="circle" className="w-12 h-12" />
    <div className="flex-1 flex flex-col gap-2"><Skeleton className="h-4 w-3/5" /><Skeleton className="h-3 w-2/5" /></div>
    <Skeleton shape="pill" className="h-btn-sm w-32" />
  </div>
);
