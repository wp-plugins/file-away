<?php
defined('SSFA_FILE') or die("Shirley, you can't be serious.");
echo '<p><dl class="accordion">
<dt><label>Read This First</label></dt>
<dd style="display:none;">First thing you need to do is tell the shortcode where to begin looking for your files. You do that here by establishing base directories. Enter at least your first base directory (you can save up to five). It can be as simple as <code>wp-uploads</code> or <code>myfiles</code>, or it could be a hundred levels deep. You can leave out leading and trailing slashes (so <code>files/docs</code> rather than <code>/files/docs/</code>). Then don\'t forget to enter a short but descriptive display name for this directory. The display name is what you\'ll see in the dropdown menu on the shortcode generator.
<br />
<br />
Note: You will be able to specify sub-directories in the shortcode generator. The base directories (at least one required) just provide you up to five quick-access starting points.
<br />
<br />
Oh, and don\'t forget about Dynamic Paths! You can create dynamic paths to different folders depending on who is logged in, all with one shortcode, using one or more of File Away\'s four dynamic path codes. See <code>Dynamic Paths</code> under the <code>Tutorials</code> tab for detailed instructions.</dd>
</dl>
</p>';