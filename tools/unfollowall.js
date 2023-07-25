const { chalk, inquirer, _, fs, instagram, print, delay } = require("./index.js");

(async () => {
    print(
        chalk`{bold.green
  ▄▄▄▄▄            ▄▄▌  .▄▄ · ▪   ▄▄ • 
  •██  ▪     ▪     ██•  ▐█ ▀. ██ ▐█ ▀ ▪
   ▐█.▪ ▄█▀▄  ▄█▀▄ ██▪  ▄▀▀▀█▄▐█·▄█ ▀█▄
   ▐█▌·▐█▌.▐▌▐█▌.▐▌▐█▌▐▌▐█▄▪▐█▐█▌▐█▄▪▐█
   ▀▀▀  ▀█▄▀▪ ▀█▄▀▪.▀▀▀  ▀▀▀▀ ▀▀▀·▀▀▀▀ 

  Ξ TITLE  : Unfollow All Following
  Ξ UPDATE : Wednesday, August 4, 2021 (GMT+8)
           : TESTED "OK" BUG? YouTellMe!
    }`
    );
    try {
        const { username, password } = await inquirer.prompt([
            {
                type: "input",
                name: "username",
                message: "Input username:",
                validate: (val) => val.length !== 0 || "Please input username!",
            },
            {
                type: "password",
                name: "password",
                mask: "*",
                message: "Input password:",
                validate: (val) => val.length !== 0 || "Please input password!",
            },
        ]);
        const ig = new instagram(username, password);
        print("Try to Login . . .", "wait", true);
        const login = await ig.login(),
            info = await ig.userInfo(login.pk);
        print(`Logged in as @${login.username} (ID: ${login.pk})`, "ok");
        print(`Collecting followed users . . .`, "wait");
        print(`You're following ${info.following_count} users!`, "ok");
        const following = await ig.followingFeed();
        print(`Doing task with ratio 1 target / 30 seconds \n`, "wait");
        let count = 0;
        do {
            let items = await following.items();
            for (let i = 0; i < items.length; i++) {
                await delay(30 * 1000); // 30 saniye bekleme (30 saniye = 30 * 1000 milisaniye)
                const user = items[i];
                const unfollow = await ig.unfollow(user.pk);
                print(`▲ @${user.username} ⇶ ${unfollow ? chalk.bold.green("Unfollowed!") : chalk.bold.red("Failed to Unfollow!")}`);
                count++;
                if (count % 100 === 0) {
                    const randomMinutes = Math.floor(Math.random() * 60) + 1; // 1 ile 60 dakika arasında rastgele bir süre belirle
                    print(`Reached ${count} unfollows. Taking a ${randomMinutes}-minute break...`, "wait", true);
                    await delay(randomMinutes * 60 * 1000); // Rastgele dakika ara (dakika = dakika * 60 * 1000 milisaniye)
                }
            }
        } while (following.moreAvailable);
        print(`Status: All Task done!`, "ok", true);
    } catch (err) {
        print(err, "err");
    }
})();
