import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Input } from "@workspace/ui/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Textarea } from "@workspace/ui/components/textarea"

export default function DesignReference() {
  return <main className="min-h-svh bg-background p-4 text-foreground sm:p-8">
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <header><p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Console Neo Reference</p><h1 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">设计系统迁移基线</h1><p className="mt-1 text-sm text-muted-foreground">固定内容用于组件包同场景截图对比。</p></header>
      <Card><CardHeader><CardTitle>基础操作</CardTitle><CardDescription>按钮、徽标和头像的真实 Console Neo 样式。</CardDescription><CardAction><Badge>运行中</Badge></CardAction></CardHeader><CardContent className="flex flex-wrap items-center gap-2"><Button>主要操作</Button><Button variant="secondary">次要操作</Button><Button variant="outline">边框按钮</Button><Button variant="ghost">幽灵按钮</Button><Button variant="destructive">危险操作</Button><AvatarGroup><Avatar><AvatarFallback>EC</AvatarFallback><AvatarBadge /></Avatar><Avatar size="sm"><AvatarFallback>UI</AvatarFallback></Avatar></AvatarGroup></CardContent><CardFooter><Button size="sm">查看详情</Button></CardFooter></Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card><CardHeader><CardTitle>数据录入</CardTitle><CardDescription>输入、选择和复选状态。</CardDescription></CardHeader><CardContent className="grid gap-3"><Input placeholder="工作区名称" defaultValue="华东运营中心"/><Textarea placeholder="补充说明"/><Select defaultValue="east"><SelectTrigger className="w-full"><SelectValue placeholder="选择区域"/></SelectTrigger><SelectContent><SelectItem value="east">华东</SelectItem><SelectItem value="west">华西</SelectItem></SelectContent></Select><label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked/>接收每周摘要</label></CardContent></Card>
        <Card><CardHeader><CardTitle>内容切换</CardTitle><CardDescription>Tabs 与 Skeleton 状态。</CardDescription></CardHeader><CardContent><Tabs defaultValue="overview"><TabsList><TabsTrigger value="overview">概览</TabsTrigger><TabsTrigger value="activity">活动</TabsTrigger></TabsList><TabsContent value="overview" className="grid gap-3 pt-3"><Skeleton className="h-4 w-2/3"/><Skeleton className="h-20 w-full"/></TabsContent><TabsContent value="activity" className="pt-3 text-sm text-muted-foreground">暂无活动记录</TabsContent></Tabs></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>数据表格</CardTitle><CardDescription>固定数据用于间距和层级对比。</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>工作区</TableHead><TableHead>状态</TableHead><TableHead className="text-right">成员</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>北区工作区</TableCell><TableCell><Badge variant="secondary">运行中</Badge></TableCell><TableCell className="text-right">24</TableCell></TableRow><TableRow><TableCell>内容运营</TableCell><TableCell><Badge variant="outline">维护</Badge></TableCell><TableCell className="text-right">12</TableCell></TableRow></TableBody></Table></CardContent></Card>
    </div>
  </main>
}
