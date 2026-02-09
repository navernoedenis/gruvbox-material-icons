import { fileIcons } from '../../core/icons/fileIcons';
import { folderIcons } from '../../core/icons/folderIcons';
import { languageIcons } from '../../core/icons/languageIcons';
import type { FolderThemeName } from '../../core/models/icons/folders/folderTheme';
import { generatePreview } from './preview';

const filterDuplicates = (icons: string[]) => {
  return [...new Set(icons)];
};

const basicFileIcons = filterDuplicates(
  [...fileIcons.icons, ...languageIcons]
    // remove icons that are clones
    .filter((i) => i.clone === undefined)
    .map((i) => i.name)
).map((i) => ({ iconName: i, label: i }));

const folderTheme = (type: FolderThemeName) => {
  let foldername = 'folder-';

  if (type === 'colorful') {
    foldername = 'colorful-folder-';
  }

  const regex = new RegExp(foldername, 'gi');

  return filterDuplicates(
    folderIcons
      .map((theme) => {
        const folders = [];
        if (theme.icons && theme.icons.length > 0) {
          folders.push(
            ...theme.icons
              // remove icons that are clones
              .filter((i) => i.clone === undefined)
              .filter((i) => i.name.startsWith(foldername))
              .map((i) => i.name)
          );
        }
        return [...folders];
      })
      .reduce((a, b) => a.concat(b))
  ).map((i) => ({ iconName: i, label: i.replace(regex, '') }));
};

const columnsOnScreen = 6;

generatePreview('fileIcons', basicFileIcons, columnsOnScreen, [
  'virtual',
  'powerpoint',
  'word',
  'credits',
]);

generatePreview(
  'folderIcons-specific',
  folderTheme('specific'),
  columnsOnScreen,
  ['folder-aurelia', 'folder-phpmailer', 'folder-syntax', 'folder-ansible']
);

generatePreview(
  'folderIcons-colorful',
  folderTheme('colorful'),
  columnsOnScreen,
  ['folder-aurelia', 'folder-phpmailer', 'folder-syntax', 'folder-ansible']
);
