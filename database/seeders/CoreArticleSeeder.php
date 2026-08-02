<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CoreArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('vi_VN');

        $images = [
            '/storage/cms/media/UI2JJFqmUMmDzai5qOlWPr7qyISZbkHxIrPguevs.jpg',
            '/storage/cms/media/6up4kBIkqmUrJ6Yg9BqtuZsb08Rvb5IQKMV4JKN5.jpg',
            '/storage/cms/media/zTIcGITth1thNUAo9O6ItutnABBH9D5cTL4X8dL2.jpg',
            '/storage/cms/media/Bc8xoF3clwdRXUIOEhTcBXuwtgUwHYPrHKlzrBqK.jpg',
            '/storage/cms/media/eR9hqGYPOoJsW7twua5xGDEwXxPtsaeE0S46pAYg.jpg',
            '/storage/cms/media/FjjwLh2MpSX20e8FZCaTFniprfMlkpLz56G40YaV.jpg',
            '/storage/cms/media/CLNuhAE8RofDCFXoqEHpWeCxuhntSUSi9CaH8rB3.jpg',
            '/storage/cms/media/I4zsxPmKZJa8IiimbHNp8t5Nps9l70QE1OmuzkI7.jpg',
            '/storage/cms/media/PiEBvwtJfFvSwoFA7k1Qppr1xq8mq97F3CoyAXje.jpg',
            '/storage/cms/media/uvx5Rgxd0EZ8pxF74hHBopbIwxUwIZZgOcwAF3Wq.jpg',
            '/storage/cms/media/DbMY9bnfvMUIrtfAn7smm5Wbwb0d3MyZR8Ygy6E7.jpg',
        ];

        // Ensure at least one user exists to be the author
        $author = \App\Models\User::first();
        $authorId = $author ? $author->id : null;

        // Set starting IDs
        // Calculate max IDs from DB to ensure we don't conflict, but guarantee minimum constraints (200 for post, 2 for article)
        $maxPostId = \Illuminate\Support\Facades\DB::table('core_post')->max('id');
        $postId = max(200, $maxPostId + 1);

        $maxArticleId = \Illuminate\Support\Facades\DB::table('core_article')->max('id');
        $articleId = max(2, $maxArticleId + 1);

        for ($i = 0; $i < 15; $i++) {
            $randomImage = $images[array_rand($images)];
            
            $content = <<<HTML
<p><img alt="" src="{$randomImage}" /></p>

<p>Ng&agrave;nh c&ocirc;ng nghiệp ph&aacute;t triển phần mềm đang thay đổi với tốc độ ch&oacute;ng mặt. Năm 2026, để lọt v&agrave;o mắt xanh của c&aacute;c nh&agrave; tuyển dụng c&ocirc;ng nghệ lớn, chỉ biết cắt HTML/CSS l&agrave; chưa đủ. Bạn cần một tư duy hệ thống v&agrave; l&agrave;m chủ c&aacute;c c&ocirc;ng cụ hiện đại.</p>

<h2>1. Nắm chắc nền tảng (Foundation is King)</h2>

<p>D&ugrave; c&oacute; bao nhi&ecirc;u framework ra đời,&nbsp;<code>HTML</code>,&nbsp;<code>CSS</code>&nbsp;v&agrave;&nbsp;<code>JavaScript</code>&nbsp;vẫn l&agrave; cốt l&otilde;i. Trong năm 2026, h&atilde;y chắc chắn rằng bạn đ&atilde; nắm vững c&aacute;c kh&aacute;i niệm sau:</p>

<ul>
	<li><strong>HTML5:</strong>&nbsp;Semantic tags, Accessibility (a11y), SEO cơ bản.</li>
	<li><strong>CSS3:</strong>&nbsp;Flexbox, CSS Grid, CSS Variables v&agrave; đặc biệt l&agrave;&nbsp;<strong>Tailwind CSS</strong>&nbsp;- c&ocirc;ng cụ đang chiếm lĩnh thị trường.</li>
	<li><strong>JavaScript (ES6+):</strong>&nbsp;Promise, Async/Await, Destructuring, Closures v&agrave; c&aacute;ch thao t&aacute;c với DOM ảo (Virtual DOM).</li>
</ul>

<blockquote>&quot;Đừng vội học React nếu bạn chưa hiểu r&otilde; c&aacute;ch&nbsp;<code>this</code>&nbsp;hoạt động trong JavaScript, hay sự kh&aacute;c biệt giữa&nbsp;<code>let</code>,&nbsp;<code>const</code>&nbsp;v&agrave;&nbsp;<code>var</code>.&quot; - Tr&iacute; Trần, Founder EduFlow.</blockquote>

<h2>2. Framework: Bắt buộc phải chọn một</h2>

<p>Thị trường hiện tại đang ưu &aacute;i&nbsp;<strong>ReactJS</strong>&nbsp;v&agrave;&nbsp;<strong>NextJS</strong>. NextJS phi&ecirc;n bản 15+ đ&atilde; mang lại c&aacute;ch tiếp cận App Router cực kỳ mạnh mẽ cho việc render dữ liệu ph&iacute;a server (SSR).</p>

<p>Dưới đ&acirc;y l&agrave; một đoạn code v&iacute; dụ cơ bản khi bạn fetch dữ liệu trong React (sử dụng Hook):</p>

<pre>
<code>import { useState, useEffect } from &#39;react&#39;;

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() =&gt; {
    fetch(&#39;https://api.example.com/users&#39;)
      .then(res =&gt; res.json())
      .then(data =&gt; setUsers(data));
  }, []);

  return (
    &lt;ul&gt;
      {users.map(user =&gt; (
        &lt;li key={user.id}&gt;{user.name}&lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre>

<h2>3. T&iacute;ch hợp c&ocirc;ng cụ AI (Trợ thủ đắc lực)</h2>

<p>AI sẽ kh&ocirc;ng cướp việc của bạn, nhưng&nbsp;<strong>một lập tr&igrave;nh vi&ecirc;n biết d&ugrave;ng AI sẽ cướp việc của bạn</strong>. H&atilde;y tập th&oacute;i quen sử dụng GitHub Copilot, ChatGPT hoặc Claude để tối ưu h&oacute;a việc viết boilerplate code, refactor code, v&agrave; viết Unit Test.</p>

<h2>Tổng kết</h2>

<p>Lộ tr&igrave;nh học Frontend lu&ocirc;n cập nhật kh&ocirc;ng ngừng. Lời khuy&ecirc;n cuối c&ugrave;ng l&agrave; h&atilde;y vừa học vừa l&agrave;m dự &aacute;n (Project-based learning). H&atilde;y tạo ra một ứng dụng Clone (như Spotify, Netflix clone), triển khai n&oacute; l&ecirc;n Vercel v&agrave; gắn v&agrave;o CV của bạn!</p>

<p>Tags:<a href="http://127.0.0.1:5500/files/blog-detail.html#">ReactJS</a><a href="http://127.0.0.1:5500/files/blog-detail.html#">NextJS</a><a href="http://127.0.0.1:5500/files/blog-detail.html#">Lộ trình IT</a></p>
HTML;

            $title = $faker->realText(60);
            
            // 1. Tạo Post
            \Illuminate\Support\Facades\DB::table('core_post')->insert([
                'id' => $postId,
                'title' => $title,
                'slug' => \Illuminate\Support\Str::slug($title) . '-' . time() . '-' . $i,
                'description' => $faker->realText(200),
                'content' => $content,
                'is_hot' => rand(0, 1),
                'is_new' => rand(0, 1),
                'published' => 'publish',
                'thumbnail' => $randomImage,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 2. Tạo Article liên kết với Post vừa tạo
            \Illuminate\Support\Facades\DB::table('core_article')->insert([
                'id' => $articleId,
                'post_id' => $postId,
                'author_id' => $authorId,
                'language' => 'vi',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $postId++;
            $articleId++;
        }
    }
}
